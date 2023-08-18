import { Module } from '@nestjs/common';
import { VoucherPssService } from './voucher.service';
import { SharedModule } from '@shared/shared.module';
import { VoucherPssController } from './voucher.controller';
import { LoggerModule } from '@common/logger/logger.module';
import { ReservationPssModule } from '../reservation/reservation.module';
import { VoucherTypePssModule } from '../voucher-type/voucher-type.module';

@Module({
  providers: [VoucherPssService],
  controllers: [VoucherPssController],
  exports: [VoucherPssService],
  imports: [
    SharedModule,
    LoggerModule,
    ReservationPssModule,
    VoucherTypePssModule,
  ],
})
export class VoucherPssModule {}
