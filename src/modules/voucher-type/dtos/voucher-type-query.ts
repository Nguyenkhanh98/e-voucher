import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class VoucherTypeQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;
}
