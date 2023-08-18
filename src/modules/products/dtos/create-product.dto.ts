import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  nameEn: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  voucherTypeId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  price: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startUseDate: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  endUseDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  descriptionEn: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  thumbnail: string;

  @ApiProperty()
  @IsOptional()
  @IsJSON()
  metadata: JSON;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  discount: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  promotion: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  limit: number;
}
