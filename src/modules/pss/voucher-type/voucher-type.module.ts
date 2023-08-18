import { Module } from '@nestjs/common';
import { VoucherTypePssService } from './voucher-type.service';
import { VoucherTypePssController } from './voucher-type.controller';
import { SharedModule } from '@shared/shared.module';

@Module({
  providers: [VoucherTypePssService],
  exports: [VoucherTypePssService],
  controllers: [VoucherTypePssController],
  imports: [SharedModule],
})
export class VoucherTypePssModule {}
