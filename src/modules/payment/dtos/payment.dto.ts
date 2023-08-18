import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PaymentResponseDto {
  @ApiResponseProperty()
  transactionId?: string;

  @ApiResponseProperty()
  endpoint?: string;
}

export class ConfirmPaymentDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  paymentKey: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  orderId: string;
}
