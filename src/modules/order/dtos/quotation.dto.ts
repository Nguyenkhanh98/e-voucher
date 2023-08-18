import { ItemType } from '@common/entities';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { OrderItemDto, PassengerInfoDto } from './order.dto';

export class OrderItemQuotationDto {
  @ApiResponseProperty()
  itemId: number;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  voucherType?: number;

  @ApiResponseProperty()
  endUseDate?: Date;

  @ApiResponseProperty()
  quantity: number;

  @ApiResponseProperty()
  price?: string;

  @ApiResponseProperty()
  discount: string;

  @ApiResponseProperty()
  totalAmount: string;

  @ApiResponseProperty()
  type: ItemType;

  @ApiResponseProperty()
  promotion: OrderItemQuotationDto;

  @ApiProperty({ type: OrderItemQuotationDto, isArray: true })
  detail?: OrderItemQuotationDto[];

  passengers?: PassengerInfoDto[];
}

export class QuotationDto {
  @ApiProperty({ isArray: true, type: OrderItemDto })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}

export class QuotationResponseDto {
  @ApiProperty({ isArray: true, type: OrderItemQuotationDto })
  items: OrderItemQuotationDto[];

  @ApiResponseProperty()
  totalAmount: string;
}
