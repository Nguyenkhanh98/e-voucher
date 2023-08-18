import { ApiProperty } from '@nestjs/swagger';

export enum EVoucherType {
  GOOD_WILL = 'good_will',
  TRAVEL_PASS = 'travel_pass',
}

export class ClaimVoucher {
  @ApiProperty()
  type: EVoucherType;

  @ApiProperty()
  reservationLator: string;

  @ApiProperty()
  name: string;
}

export class ClaimVoucherQuery {
  @ApiProperty()
  type: EVoucherType;

  @ApiProperty()
  reservationLocator: string;
}
