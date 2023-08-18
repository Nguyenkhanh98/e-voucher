import {
  CustomerEntity,
  OrderEntity,
  OrderItemEntity,
  ProductEntity,
} from '@common/entities';
import { PaymentTransactionEntity } from '@common/entities/payment-transaction.entity';
import { LoggerModule } from '@common/logger/logger.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PaymentModule } from '@module/payment/payment.module';
import { SharedModule } from '@shared/shared.module';
import { ProductModule } from '@module/products/products.module';
import { CampaignModule } from '@module/campaign/campaign.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderItemEntity,
      ProductEntity,
      PaymentTransactionEntity,
      CustomerEntity,
    ]),
    LoggerModule,
    PaymentModule,
    SharedModule,
    ProductModule,
    CampaignModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
