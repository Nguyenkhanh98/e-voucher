import { BadRequestException, Injectable } from '@nestjs/common';

import { PSS } from '@common/config/enviroment.config';
import { AppLogger } from '@common/logger/logger.service';
import { PssHttpService } from '@shared/services';
import { ReservationByKeyDTO } from '../reservation/dtos';
import { ReservationPssService } from '../reservation/reservation.service';
import { VoucherTypePssService } from '../voucher-type/voucher-type.service';
import { UpdateVoucherDTO } from './dtos';
import {
  ClaimVoucher,
  ClaimVoucherQuery,
  EVoucherType,
} from './dtos/claim-voucher';
import {
  CreateVoucherDTO,
  CustomerVoucherDTO,
} from './dtos/create-voucher.dto';
import { VoucherDTO, VoucherGeneratedDTO } from './dtos/voucher.dto';

@Injectable()
export class VoucherPssService {
  constructor(
    private _pss: PssHttpService,
    private readonly reservationService: ReservationPssService,
    private readonly voucherType: VoucherTypePssService,
    private readonly logger: AppLogger,
  ) {}
  public async getVoucherByKey(key: string): Promise<VoucherDTO> {
    try {
      const { data } = await this._pss.get(`${PSS.VOUCHER_ENDPOINT}/${key}`);
      return data;
    } catch (err) {
      throw err;
    }
  }

  public async generateVouchers(
    body: CreateVoucherDTO,
  ): Promise<VoucherGeneratedDTO[]> {
    try {
      const { data } = await this._pss.post(
        PSS.VOUCHER_GENERATE_ENDPOINT,
        body,
      );
      return data;
    } catch (err) {
      throw err;
    }
  }

  public async updateVoucher(
    key: string,
    body: UpdateVoucherDTO,
  ): Promise<VoucherDTO> {
    try {
      const { data } = await this._pss.put(
        `${PSS.VOUCHER_ENDPOINT}/${key}`,
        body,
      );
      return data;
    } catch (err) {
      throw err;
    }
  }

  public async generaVoucherWithIdentifier(
    body: CreateVoucherDTO,
    customers: CustomerVoucherDTO[],
  ): Promise<VoucherDTO[]> {
    try {
      const length = customers.length;
      if (length !== body.generationNumber) {
        throw new BadRequestException('Invalid length');
      }

      const vouchers = await this.generateVouchers(body);

      function waitIASServerSync(): Promise<VoucherDTO[]> {
        return new Promise((resolve) => {
          setTimeout(async () => {
            const vouchersAssigned = await Promise.allSettled(
              vouchers.map((voucher, index) => {
                return this._pss.put(`${PSS.VOUCHER_ENDPOINT}/${voucher.key}`, {
                  ...voucher,
                  passengerName: `${customers[index].lastName}, ${customers[index].firstName}`,
                });
              }),
            );

            const successfulResults = vouchersAssigned.map(
              (result) => result['value'],
            );
            resolve(successfulResults);
          }, 5000);
        });
      }

      const result: VoucherDTO[] = await waitIASServerSync();

      const failures = [];
      const successResults = result.filter((voucher, idx) => {
        if (!voucher) {
          failures.push(vouchers[idx]);
        }
        return !!voucher;
      });

      this.logger.log('ERROR VOUCHER', JSON.stringify(failures));

      return successResults;
    } catch (err) {
      throw err;
    }
  }

  public async getClaimVoucher(
    query: ClaimVoucherQuery,
  ): Promise<ReservationByKeyDTO> {
    const reservation: ReservationByKeyDTO =
      await this.reservationService.getReservationByLocator(
        query.reservationLocator,
      );
    return reservation;
  }

  public async claimVoucher(body: ClaimVoucher): Promise<VoucherDTO[]> {
    const reservation: ReservationByKeyDTO =
      await this.reservationService.getReservationByLocator(
        body.reservationLator,
      );

    const cancleFlight = reservation.journeys.filter(
      (journey) => journey.reservationStatus.cancelled,
    );

    if (cancleFlight.length > 0) {
      const passengers: any[] = reservation.passengers.map((passenger) => {
        return {
          email: passenger.reservationProfile.personalContactInformation.email,
          firstName: passenger.reservationProfile.firstName,
          lastName: passenger.reservationProfile.lastName,
        };
      });

      const voucherType = await this.voucherType.getVoucherTypeByKey(
        EVoucherType.GOOD_WILL,
      );

      const currentDate = new Date();
      currentDate.setFullYear(currentDate.getFullYear() + 1);
      const redeemVoucher: CreateVoucherDTO = {
        voucherType: {
          key: voucherType.key,
          name: voucherType.name,
          href: voucherType.href,
        },
        generationNumber: 2,
        autoGeneratePersonalIdentificationNumber: {
          length: 4,
        },
        autoGeneratePassword: {
          length: 6,
        },
        expiryDate: currentDate,
        available: 2,
        reason: 'generate willing',
      };

      const generateVoucher = await this.generaVoucherWithIdentifier(
        redeemVoucher,
        passengers,
      );

      return generateVoucher;
    }
    return null;
  }
}
