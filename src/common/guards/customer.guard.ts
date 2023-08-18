import { CUSTOMER_KEY } from '@common/decorators/customer.decorator';
import { CustomerEntity, CustomerStatus } from '@common/entities';
import { AppException } from '@common/exceptions/app-exception';
import {
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
export class CustomerGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requiredCustomer = this.reflector.getAllAndOverride<boolean>(
      CUSTOMER_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredCustomer) {
      if (!request.headers['authorization']) {
        throw new AppException(UN_AUTHORIZED);
      }
      const accessToken = request.headers['authorization'].split(' ')[1];

      const verifyToken = this.authenticationHandle(
        accessToken,
        this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      );
      const findCustomer: CustomerEntity =
        await this.customerRepository.findOne({
          where: {
            id: verifyToken.user.id,
          },
        });

      if (!findCustomer) {
        throw new AppException(USER_NOT_FOUND);
      }

      if (findCustomer.status !== CustomerStatus.ACTIVE) {
        throw new AppException(USER_NOT_ACTIVE);
      }
      request.user = findCustomer;
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
