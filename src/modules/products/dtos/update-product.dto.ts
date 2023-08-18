import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsJSON,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProductDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  nameEn: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startUseDate: Date;

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endUseDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  descriptionEn: string;

  @ApiProperty()
  @IsOptional()
  @IsJSON()
  metadata: JSON;

  @ApiProperty()
  @IsOptional()
  @IsString()
  thumbnail: string;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  price: string;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  discount: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  promotion: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  active: boolean;
}
