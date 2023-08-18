import { Module } from '@nestjs/common';
import { ReservationPssService } from './reservation.service';
import { SharedModule } from '@shared/shared.module';

@Module({
  providers: [ReservationPssService],
  exports: [ReservationPssService],
  imports: [SharedModule],
})
export class ReservationPssModule {}
