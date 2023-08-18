import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { LoginAuthDto } from './dtos/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserRole, UserStatus } from '@common/entities/user.entity';
import { LoginResponse } from './dtos/auth-response.dto';
import { AppLogger } from '@common/logger/logger.service';
import * as bcrypt from 'bcrypt';
import { AppException } from '@common/exceptions/app-exception';
import {
  ROLE_NOT_FOUND,
  USER_NOT_ACTIVE,
  WRONG_EMAIL_OR_PASSWORD,
} from '@common/exceptions/error';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@module/users/users.service';
import { RegisterUser } from './dtos/register.dto';
import { CustomerEntity, CustomerStatus } from '@common/entities';
import { ApiKey } from '@common/constants/api-key';
import { PermissionDto } from './dtos/permission.dto';
import { RolePermissionEntity } from '@common/entities/role-permission.entity';
import { differenceWith, intersectionBy, isEqual } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermissionRepository: Repository<RolePermissionEntity>,
    private readonly logger: AppLogger,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async login(loginData: LoginAuthDto): Promise<LoginResponse> {
    const findUser: UserEntity = await this.validateUser(
      loginData.email,
      loginData.password,
    );
    return this.generateToken(findUser);
  }

  async register(registerData: RegisterUser) {
    return this.userService.createUser({
      ...registerData,
      role: UserRole.USER,
    });
  }

  async getPermission() {
    return Object.values(ApiKey);
  }

  async addPermission(permissionData: PermissionDto) {
    if (!Object.values(UserRole).includes(permissionData.role)) {
      throw new AppException(ROLE_NOT_FOUND);
    }

    const rolePermission = await this.rolePermissionRepository.find({
      where: { role: permissionData.role },
    });

    const currentPermissions = rolePermission.flatMap(
      (item) => item.permission,
    );

    const addPermissions = differenceWith(
      permissionData.permissions,
      currentPermissions,
      isEqual,
    );

    await this.rolePermissionRepository.save(
      addPermissions.map((item) => {
        return {
          role: permissionData.role,
          permission: item,
        };
      }),
    );

    const result = {
      role: permissionData.role,
      permissions: [...currentPermissions, ...addPermissions],
    };

    return result;
  }

  async removePermission(permissionData: PermissionDto) {
    if (!Object.values(UserRole).includes(permissionData.role)) {
      throw new AppException(ROLE_NOT_FOUND);
    }

    const rolePermission = await this.rolePermissionRepository.find({
      where: { role: permissionData.role },
    });

    const permissionMap = permissionData.permissions.map((item) => {
      return { permission: item };
    });

    const removePermissions = intersectionBy(
      rolePermission,
      permissionMap,
      'permission',
    );

    if (removePermissions.length > 0)
      await this.rolePermissionRepository.remove(removePermissions);

    const result = {
      role: permissionData.role,
      permissions: rolePermission
        .filter((item) => !removePermissions.includes(item))
        .flatMap((item) => item.permission),
    };

    return result;
  }

  async customerLogin(loginData: LoginAuthDto): Promise<LoginResponse> {
    const findCustomer: CustomerEntity = await this.validateCustomer(
      loginData.email,
      loginData.password,
    );
    return this.generateToken(findCustomer);
  }

  private async generateToken(
    user: UserEntity | CustomerEntity,
  ): Promise<LoginResponse> {
    const payload = {
      sub: user.id,
      isCustomer: user instanceof CustomerEntity ? true : false,
      user,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      ),
    });

    return {
      accessToken,
      user,
    };
  }

  private async validateCustomer(email: string, password: string) {
    const findCustomer = await this.customerRepository.findOne({
      where: { email: email },
    });
    if (
      !findCustomer ||
      !(await bcrypt.compare(password, findCustomer.password))
    )
      throw new AppException(WRONG_EMAIL_OR_PASSWORD);
    if (findCustomer.status !== CustomerStatus.ACTIVE) {
      throw new AppException(USER_NOT_ACTIVE);
    }
    return findCustomer;
  }

  private async validateUser(email: string, password: string) {
    const findUser = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!findUser || !(await bcrypt.compare(password, findUser.password)))
      throw new AppException(WRONG_EMAIL_OR_PASSWORD);
    if (findUser.status !== UserStatus.ACTIVE) {
      throw new AppException(USER_NOT_ACTIVE);
    }
    return findUser;
  }
}
