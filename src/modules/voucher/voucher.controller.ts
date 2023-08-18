import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ClaimVoucherQuery } from './dtos';
import { GetClaimVoucherResponse } from './dtos/claim-voucher-response';
import { VoucherService } from './voucher.service';

@ApiTags('Vouchers')
@Controller('/vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Get('/claim')
  @UseInterceptors(ClassSerializerInterceptor)
  async getVoucherClaim(
    @Query() query: ClaimVoucherQuery,
  ): Promise<GetClaimVoucherResponse> {
    return await this.voucherService.getClaimVoucher(query);
  }
}
