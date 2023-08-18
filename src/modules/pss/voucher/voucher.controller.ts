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
import { ApiTags } from '@nestjs/swagger';
import { VoucherDTO, VoucherGeneratedDTO } from './dtos/voucher.dto';
import { VoucherPssService } from './voucher.service';
import {
  CreateVoucherDTO,
  CreateVoucherReponseSchema,
  UpdateVoucherDTO,
} from './dtos';
import { ClaimVoucher, ClaimVoucherQuery } from './dtos/claim-voucher';
import { ReservationByKeyDTO } from '../reservation/dtos';

@ApiTags('pss/voucher')
@Controller('/pss/voucher')
export class VoucherPssController {
  constructor(private readonly voucherPssService: VoucherPssService) {}

  @Get(':key')
  @UseInterceptors(ClassSerializerInterceptor)
  async getVoucherPssByKey(@Param('key') key: string): Promise<VoucherDTO> {
    return await this.voucherPssService.getVoucherByKey(key);
  }

  @Post('')
  @CreateVoucherReponseSchema()
  @UseInterceptors(ClassSerializerInterceptor)
  async genereateVoucherPss(
    @Body() body: CreateVoucherDTO,
  ): Promise<VoucherGeneratedDTO[]> {
    return await this.voucherPssService.generateVouchers(body);
  }

  @Put(':key')
  @UseInterceptors(ClassSerializerInterceptor)
  async updateVoucherPssByKey(
    @Param('key') key: string,
    @Body() body: UpdateVoucherDTO,
  ): Promise<VoucherDTO> {
    return await this.voucherPssService.updateVoucher(key, body);
  }

  @Get('/claim')
  @UseInterceptors(ClassSerializerInterceptor)
  async getClaimVoucher(
    @Query() query: ClaimVoucherQuery,
  ): Promise<ReservationByKeyDTO> {
    return await this.voucherPssService.getClaimVoucher(query);
  }

  @Post('/claim')
  @UseInterceptors(ClassSerializerInterceptor)
  async claimVoucher(@Body() body: ClaimVoucher): Promise<VoucherDTO[]> {
    return await this.voucherPssService.claimVoucher(body);
  }
}
