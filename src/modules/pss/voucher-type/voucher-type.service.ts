import { Injectable } from '@nestjs/common';

import { PSS } from '@common/config/enviroment.config';
import { PssHttpService } from '@shared/services';
import { VoucherTypeDTO } from './dtos/voucher-type.dto';

@Injectable()
export class VoucherTypePssService {
  constructor(private _pss: PssHttpService) {}
  public async getVoucherTypes(): Promise<VoucherTypeDTO[]> {
    try {
      const { data } = await this._pss.get(`${PSS.VOUCHER_TYPE_ENDPOINT}`);
      return data;
    } catch (err) {
      throw err;
    }
  }

  public async getVoucherTypeByKey(key: string): Promise<VoucherTypeDTO> {
    try {
      const { data } = await this._pss.get(
        `${PSS.VOUCHER_TYPE_ENDPOINT}/${key}`,
      );
      return data;
    } catch (err) {
      throw err;
    }
  }

  public async createVoucherType(
    body: VoucherTypeDTO,
  ): Promise<VoucherTypeDTO> {
    try {
      const { data } = await this._pss.post(
        `${PSS.VOUCHER_TYPE_ENDPOINT}`,
        body,
      );
      return data;
    } catch (err) {
      throw err;
    }
  }
}
