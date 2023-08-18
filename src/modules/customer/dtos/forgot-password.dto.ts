import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
