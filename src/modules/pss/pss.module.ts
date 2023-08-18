import { Module } from '@nestjs/common';
import { VoucherTypePssModule } from './voucher-type/voucher-type.module';
import { VoucherTypePssService } from './voucher-type/voucher-type.service';
import { VoucherPssModule } from './voucher/voucher.module';
import { ReservationPssModule } from './reservation/reservation.module';
import { VoucherPssService } from './voucher/voucher.service';
import { ReservationPssService } from './reservation/reservation.service';
import { LoggerModule } from '@common/logger/logger.module';

import { SharedModule } from '@shared/shared.module';

@Module({
  exports: [VoucherTypePssService, VoucherPssService],
  providers: [VoucherTypePssService, VoucherPssService, ReservationPssService],
  imports: [
    SharedModule,
    VoucherTypePssModule,
    VoucherPssModule,
    ReservationPssModule,
    LoggerModule,
  ],
})
export class PssModule {}
