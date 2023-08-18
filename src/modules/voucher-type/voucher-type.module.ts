import { Module } from '@nestjs/common';
import { VoucherTypeController } from './voucher-type.controller';
import { VoucherTypeService } from './voucher-type.service';
import { VoucherTypeEntity } from '@common/entities/vouchery-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@common/logger/logger.module';
import { ReservationPssModule } from '@module/pss/reservation/reservation.module';
import { VoucherTypePssModule } from '@module/pss/voucher-type/voucher-type.module';
import { VoucherPssModule } from '@module/pss/voucher/voucher.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([VoucherTypeEntity]),
    LoggerModule,
    VoucherPssModule,
    VoucherTypePssModule,
    ReservationPssModule,
  ],
  controllers: [VoucherTypeController],
  providers: [VoucherTypeService],
  exports: [VoucherTypeService],
})
export class VoucherTypeModule {}
