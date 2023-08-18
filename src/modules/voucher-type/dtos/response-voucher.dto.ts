import { VoucherTypeListDTO } from '@module/pss/voucher-type/dtos/voucher-type.dto';
import { ApiResponseProperty } from '@nestjs/swagger';

export class CreateVoucherTypeResponse {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  type: string;

  @ApiResponseProperty()
  rules: any;

  @ApiResponseProperty()
  voucherPssType: VoucherTypeListDTO;

  @ApiResponseProperty()
  description: string;

  @ApiResponseProperty()
  status: string;
}
