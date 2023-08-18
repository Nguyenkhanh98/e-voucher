import { Module } from '@nestjs/common';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './products/products.module';
import { PssModule } from './pss/pss.module';
import { OrderModule } from './order/order.module';
import { VoucherModule } from './/voucher/voucher.module';
import { PaymentModule } from './payment/payment.module';
import { CustomerModule } from './customer/customer.module';
import { PermissionsGuard } from '@common/guards/permission.guard';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BehaviorLogEntity,
  CustomerEntity,
  ProductEntity,
  UserEntity,
  VoucherTypeEntity,
} from '@common/entities';
import { VoucherTypeModule } from './voucher-type/voucher-type.module';
import { RolePermissionEntity } from '@common/entities/role-permission.entity';
import { CampaignModule } from './campaign/campaign.module';
import { CustomerAdminModule } from './customer/customer-admin.module';
import { BehaviorLogInterceptor } from '@common/interceptors/behavior-log.interceptor';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ProductModule,
    PssModule,
    OrderModule,
    PaymentModule,
    CustomerModule,
    CampaignModule,
    VoucherModule,
    VoucherTypeModule,
    CustomerAdminModule,
    TypeOrmModule.forFeature([
      UserEntity,
      CustomerEntity,
      ProductEntity,
      RolePermissionEntity,
      VoucherTypeEntity,
      BehaviorLogEntity,
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: BehaviorLogInterceptor,
    },
    JwtService,
  ],
})
export class ApiModule {}
