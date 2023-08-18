import { VoucherTypeListDTO } from '@module/pss/voucher-type/dtos/voucher-type.dto';
import { CreateVoucherTypeResponse } from '@module/voucher-type/dtos/response-voucher.dto';
import { ApiResponseProperty } from '@nestjs/swagger';

export class CreateProductResponse {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  voucherType: CreateVoucherTypeResponse;

  @ApiResponseProperty()
  price: any;

  @ApiResponseProperty()
  startDate: VoucherTypeListDTO;

  @ApiResponseProperty()
  endDate: string;

  @ApiResponseProperty()
  startUseDate: Date;

  @ApiResponseProperty()
  endUseDate: Date;

  @ApiResponseProperty()
  description: string;

  @ApiResponseProperty()
  metadata: JSON;

  @ApiResponseProperty()
  discount: string;

  @ApiResponseProperty()
  promotion: number;

  @ApiResponseProperty()
  active: string;
}
