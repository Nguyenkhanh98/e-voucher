import { VoucherTypeEntity } from '@common/entities';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class GetProductQuery {
  @ApiProperty({ required: false, enum: VoucherTypeEntity._GroupType })
  @IsOptional()
  @IsString()
  groupType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  active?: boolean;
}
