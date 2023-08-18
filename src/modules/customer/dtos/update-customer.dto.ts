import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateCustomer {
  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber('VN')
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password: string;
}
