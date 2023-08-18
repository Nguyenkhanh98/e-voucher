import { ApiKey } from '@common/constants/api-key';
import { AUTH_KEY } from '@common/decorators/auth.decorator';
import { PERMISSIONS_KEY } from '@common/decorators/permission.decorator';
import { ROLE_KEY } from '@common/decorators/role.decorator';
import { RolePermissionEntity } from '@common/entities/role-permission.entity';
import { UserEntity, UserRole, UserStatus } from '@common/entities/user.entity';
import { AppException } from '@common/exceptions/app-exception';
import {
  FORBIDDEN,
  UN_AUTHORIZED,
  USER_NOT_ACTIVE,
  USER_NOT_FOUND,
} from '@common/exceptions/error';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const requiredAuth = this.reflector.getAllAndOverride<boolean>(AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredRole = this.reflector.getAllAndOverride<UserRole[]>(
      ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );

    const permission = this.reflector.getAllAndOverride<ApiKey>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // handle authentication
    if (requiredAuth) {
      if (!request.headers['authorization']) {
        throw new AppException(UN_AUTHORIZED);
      }
      const accessToken = request.headers['authorization'].split(' ')[1];

      const verifyToken = this.authenticationHandle(
        accessToken,
        this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      );
      const findUser: UserEntity = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: verifyToken.user.id })
        .leftJoinAndMapMany(
          'user.rolePermission',
          RolePermissionEntity,
          'rolePermission',
          'user.role = rolePermission.role',
        )
        .getOne();

      if (!findUser) {
        throw new AppException(USER_NOT_FOUND);
      }

      if (findUser.status !== UserStatus.ACTIVE) {
        throw new AppException(USER_NOT_ACTIVE);
      }

      const permission = findUser.rolePermission.flatMap(
        (item) => item.permission,
      );
      delete findUser.rolePermission;
      request.user = { ...findUser, permission };
    }

    // handle permission role
    if (requiredRole) {
      if (request?.user?.role === UserRole.SUPER_ADMIN) {
        return true;
      }
      const userRole: UserRole = request?.user?.role;
      const isValid = requiredRole.includes(userRole);

      if (!isValid) {
        throw new AppException(FORBIDDEN);
      }

      if (permission) {
        // handle check permission
        const userPermission: ApiKey[] = request.user?.permission;
        const isValidPermission = userPermission.includes(permission);
        if (!isValidPermission) {
          throw new AppException(FORBIDDEN);
        }
      }
    }

    return true;
  }

  private authenticationHandle(accessToken: string, secret: string) {
    try {
      return this.jwtService.verify(accessToken, {
        secret,
      });
    } catch (error) {
      throw new AppException(UN_AUTHORIZED);
    }
  }
}
