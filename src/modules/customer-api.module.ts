import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.module';
import { CustomerGuard } from '@common/guards/customer.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity, ProductEntity, UserEntity } from '@common/entities';

@Module({
  imports: [
    CustomerModule,
    TypeOrmModule.forFeature([UserEntity, CustomerEntity, ProductEntity]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomerGuard,
    },
    JwtService,
  ],
})
export class CustomerApiModule {}
