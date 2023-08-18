import { CustomerEntity } from '@common/entities';
import { LoggerModule } from '@common/logger/logger.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from './services/customer.service';
import { AuthModule } from '@module/auth/auth.module';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity]),
    LoggerModule,
    AuthModule,
    SharedModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
