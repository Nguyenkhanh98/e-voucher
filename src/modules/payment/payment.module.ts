import { OrderEntity } from '@common/entities';
import { PaymentTransactionEntity } from '@common/entities/payment-transaction.entity';
import { LoggerModule } from '@common/logger/logger.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GpayService } from './services/gpay.service';
import { PaymentService } from './services/payment.service';
import { SharedModule } from '@shared/shared.module';
import { PaymentController } from './payment.controller';
import { PssModule } from '@module/pss/pss.module';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([OrderEntity, PaymentTransactionEntity]),
    LoggerModule,
    HttpModule,
    PssModule,
  ],
  controllers: [PaymentController],
  providers: [GpayService, PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
