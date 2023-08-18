import { ApiOkResponse, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsObject } from 'class-validator';

export class VoucherType {
  @ApiProperty()
  href: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;
}

class AutoGeneratePersonalIdentificationNumber {
  @ApiProperty()
  @IsNumber()
  length: number;
}

class AutoGeneratePassword {
  @ApiProperty()
  @IsNumber()
  length: number;
}
export class CreateVoucherDTO {
  @ApiProperty()
  @IsObject()
  voucherType: VoucherType;

  @ApiProperty()
  @IsNumber()
  generationNumber: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  personalIdentificationNumber?: string;

  @ApiProperty()
  autoGeneratePersonalIdentificationNumber: AutoGeneratePersonalIdentificationNumber;

  @ApiProperty()
  autoGeneratePassword: AutoGeneratePassword;

  @ApiProperty()
  @IsString()
  expiryDate: Date;

  @ApiProperty()
  @IsNumber()
  available: number;

  @ApiProperty()
  @IsString()
  reason: string;
}

export class CustomerVoucherDTO {
  @ApiProperty()
  @IsObject()
  email: VoucherType;

  @ApiProperty()
  @IsNumber()
  firstName: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName: string;
}
