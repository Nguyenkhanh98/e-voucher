import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsObject } from 'class-validator';
import { IssuedReservation, IssuedFlight, VoucherStatus } from './voucher.dto';

export class UpdateVoucherDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  passengerName?: string;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  status?: VoucherStatus;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  issuedReservation?: IssuedReservation;

  @ApiProperty()
  @IsString()
  @IsOptional()
  issuedFlight?: IssuedFlight;

  @ApiProperty()
  @IsString()
  timestamp?: string;
}
