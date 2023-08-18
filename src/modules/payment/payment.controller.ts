import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentService } from './services/payment.service';
import { ConfirmPaymentDto } from './dtos/payment.dto';

@ApiTags('Payments')
@Controller('/payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('confirm')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async confirmTransaction(@Body() confirmData: ConfirmPaymentDto) {
    return this.paymentService.confirmPayment(confirmData);
  }
}
