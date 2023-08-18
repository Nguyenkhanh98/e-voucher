import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CampaignItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  itemId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CampaignDto {
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
  @IsString()
  thumbnail: string;

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
  @IsObject()
  metadata: object;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  discount: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  limit: number;

  @ApiProperty({ type: CampaignItemDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  items: CampaignItemDto[];
}

export class UpdateCampaignDto {
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
  @IsString()
  endDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate()
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
  @IsObject()
  metadata: object;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  discount: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  limit: number;

  @ApiProperty({ type: CampaignItemDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  items: CampaignItemDto[];
}
