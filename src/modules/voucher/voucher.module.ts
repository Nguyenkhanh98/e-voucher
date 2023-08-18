import { Module } from '@nestjs/common';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { LoggerModule } from '@common/logger/logger.module';
import { ReservationPssModule } from '@module/pss/reservation/reservation.module';
import { VoucherTypeModule } from '@module/voucher-type/voucher-type.module';
import { VoucherPssModule } from '@module/pss/voucher/voucher.module';
import { VoucherTypePssModule } from '@module/pss/voucher-type/voucher-type.module';
@Module({
  imports: [
    LoggerModule,
    VoucherPssModule,
    VoucherTypeModule,
    ReservationPssModule,
    VoucherTypePssModule,
  ],
  controllers: [VoucherController],
  providers: [VoucherService],
  exports: [VoucherService],
})
export class VoucherModule {}
