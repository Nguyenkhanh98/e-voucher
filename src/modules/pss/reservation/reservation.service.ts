import { Injectable } from '@nestjs/common';

import { PSS } from '@common/config/enviroment.config';
import { PssHttpService } from '@shared/services';
import { ReservationByKeyDTO } from './dtos';

@Injectable()
export class ReservationPssService {
  constructor(private _pss: PssHttpService) {}
  public async getReservationByLocator(locator): Promise<ReservationByKeyDTO> {
    try {
      const { data } = await this._pss.get(
        `${PSS.RESERVATION_ENNDPOINT}?reservationLocator=${locator}`,
      );
      const reservationDetail = this.getReservationByKey(data[0].key);
      return reservationDetail;
    } catch (err) {
      throw err;
    }
  }

  public async getReservationByKey(key: string): Promise<ReservationByKeyDTO> {
    try {
      const { data } = await this._pss.get(
        `${PSS.RESERVATION_ENNDPOINT}/${key}`,
      );
      return data;
    } catch (err) {
      throw err;
    }
  }
}
