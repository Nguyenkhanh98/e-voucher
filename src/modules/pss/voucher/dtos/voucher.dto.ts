import { VoucherTypeDTO } from '@module/pss/voucher-type/dtos/voucher-type.dto';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';

export class VoucherGeneratedDTO {
  @ApiProperty()
  href: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  serialNumber: string;

  @ApiProperty()
  passengerName: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  expiryDate: string;
}

export class VoucherStatus {
  expired: boolean;
  current: boolean;
  future: boolean;
}

export class IssuedReservation {
  @ApiProperty()
  number: number;

  @ApiProperty()
  locator: string;
}

class Journey {
  @ApiProperty()
  localScheduledTime: string;
}
export class IssuedFlight {
  @ApiProperty()
  flightNumber: number;

  @ApiProperty()
  departure: Journey;
}

export class VoucherDTO {
  @ApiProperty()
  href: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  serialNumber: string;

  @ApiProperty()
  passengerName: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  expiryDate: string;

  @ApiProperty()
  voucherType: VoucherTypeDTO;

  @ApiProperty()
  status: VoucherStatus;

  @ApiProperty()
  personalIdentificationNumber: string;

  @ApiProperty()
  redeemedReservations: any;

  @ApiProperty()
  available: number;

  @ApiProperty()
  redeemed: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  issuedReservation: IssuedReservation;

  @ApiProperty()
  issuedFlight: IssuedFlight;
}

export const CreateVoucherReponseSchema = () => {
  return ApiResponse({
    status: 201,
    description: 'Successful response',
    type: [VoucherGeneratedDTO],
  });
};
