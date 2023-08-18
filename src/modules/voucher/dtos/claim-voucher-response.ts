import { ReservationByKeyDTO } from '@module/pss/reservation/dtos';
import { ApiResponseProperty } from '@nestjs/swagger';

export class GetClaimVoucherResponse {
  @ApiResponseProperty()
  reservation: ReservationByKeyDTO;

  @ApiResponseProperty()
  availableVoucher: any;
}
