import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { VoucherTypeService } from './voucher-type.service';
import { CreateVoucherTypeDTO } from './dtos/create-voucher.dto';
import { CreateVoucherTypeResponse } from './dtos/response-voucher.dto';
import { VoucherTypeQuery } from './dtos/voucher-type-query';

@ApiTags('VoucherType')
@Controller('/voucher-types')
export class VoucherTypeController {
  constructor(private readonly voucherTypeService: VoucherTypeService) {}

  @Post('/')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiCreatedResponse({ type: CreateVoucherTypeResponse })
  async createVoucherType(@Body() body: CreateVoucherTypeDTO) {
    return await this.voucherTypeService.createVoucherType(body);
  }

  @Put(':id')
  @ApiOkResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  async updateVoucherType(
    @Body() body: CreateVoucherTypeDTO,
    @Param('id') id: string,
  ) {
    return await this.voucherTypeService.updateVoucherType(id, body);
  }

  @Get('/')
  @ApiOkResponse({ type: [CreateVoucherTypeResponse] })
  @UseInterceptors(ClassSerializerInterceptor)
  async getVoucherType(@Query() query: VoucherTypeQuery) {
    return await this.voucherTypeService.getVoucherType(query);
  }
}
