import { CustomerEntity } from '@common/entities';
import { LoggerModule } from '@common/logger/logger.module';
import { AuthModule } from '@module/auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@shared/shared.module';
import { CustomerAdminController } from './controllers/customer-admin.controller';
import { CustomerService } from './services/customer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity]),
    LoggerModule,
    AuthModule,
    SharedModule,
  ],
  controllers: [CustomerAdminController],
  providers: [CustomerService],
})
export class CustomerAdminModule {}
