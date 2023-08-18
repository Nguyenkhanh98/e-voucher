import { ApiProperty } from '@nestjs/swagger';

export class ClaimVoucher {
  @ApiProperty()
  voucherTypeId: number;

  @ApiProperty()
  reservationLator: string;

  @ApiProperty()
  name: string;
}

export class ClaimVoucherQuery {
  @ApiProperty()
  voucherTypeId: number;

  @ApiProperty()
  reservationLocator: string;
}
