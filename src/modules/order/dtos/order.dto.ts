import { ItemType } from '@common/entities/order-item.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CustomerInfoDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber('VN')
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class PassengerInfoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber('VN')
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class OrderItemPassengerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  itemId: number;

  @ApiProperty({ type: PassengerInfoDto })
  @ValidateNested({ each: true })
  @Type(() => PassengerInfoDto)
  passengersInfo: PassengerInfoDto;
}

export class OrderItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  itemId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ default: ItemType.PRODUCT })
  @IsNotEmpty()
  @IsEnum(ItemType)
  type: ItemType;
}

export class ConfirmOrderItemDto extends OrderItemDto {
  @ApiProperty({ type: OrderItemPassengerDto, isArray: true })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemPassengerDto)
  passengers?: OrderItemPassengerDto[];
}

export class ConfirmOrderDto {
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CustomerInfoDto)
  customerInfo: CustomerInfoDto;

  @ApiProperty({ type: ConfirmOrderItemDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConfirmOrderItemDto)
  orderItems: ConfirmOrderItemDto[];

  @ApiProperty()
  @IsString()
  totalAmount: string;
}
