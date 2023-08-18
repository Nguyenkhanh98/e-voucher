import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  VoucherTypeDTO,
  VoucherTypeListDTO,
  VoucherTypeReponseSchema,
} from './dtos/voucher-type.dto';
import { VoucherTypePssService } from './voucher-type.service';

@ApiTags('pss/voucher-types')
@Controller('/pss/voucher-types')
export class VoucherTypePssController {
  constructor(private readonly voucherTypePssService: VoucherTypePssService) {}

  @Get('/')
  @UseInterceptors(ClassSerializerInterceptor)
  @VoucherTypeReponseSchema()
  async getVoucherTypePss(): Promise<VoucherTypeListDTO[]> {
    return await this.voucherTypePssService.getVoucherTypes();
  }

  @Get(':key')
  async getVoucherByKey(@Param('key') key: string): Promise<VoucherTypeDTO> {
    return await this.voucherTypePssService.getVoucherTypeByKey(key);
  }

  @Post('/')
  async createVoucherType(@Body() body): Promise<VoucherTypeDTO> {
    return await this.voucherTypePssService.createVoucherType(body);
  }
}
