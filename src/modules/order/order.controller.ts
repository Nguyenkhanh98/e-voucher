import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ConfirmOrderDto } from './dtos/order.dto';
import { OrderService } from './order.service';
import { QuotationDto, QuotationResponseDto } from './dtos/quotation.dto';
import { PaymentResponseDto } from '@module/payment/dtos/payment.dto';
import { UsePaginate } from '@common/decorators/use-paginate.decorator';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { GetOrderOptions } from './dtos/get-order.option';

@ApiTags('Orders')
@Controller('/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @UsePaginate(GetOrderOptions)
  @UseInterceptors(ClassSerializerInterceptor)
  async getOrders(@Paginate() query: PaginateQuery) {
    return this.orderService.getOrders(query);
  }

  @Get('/info/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async getOrderInfo(@Param('id') id: number) {
    return this.orderService.getInfoOrder(id);
  }

  @Post('quotation')
  @ApiOkResponse({ type: QuotationResponseDto })
  @HttpCode(HttpStatus.OK)
  async quotatonOrder(@Body() quotationData: QuotationDto) {
    return this.orderService.quotationOrder(quotationData);
  }

  @Post('confirm')
  @ApiOkResponse({ type: PaymentResponseDto })
  @HttpCode(HttpStatus.OK)
  async confirmOrder(@Body() orderData: ConfirmOrderDto) {
    return this.orderService.confirmOrder(orderData);
  }
}
