import { Injectable } from '@nestjs/common';

import { CreateVoucherDTO } from '@module/pss/voucher/dtos/create-voucher.dto';

import { AppLogger } from '@common/logger/logger.service';
import { ReservationByKeyDTO } from '@module/pss/reservation/dtos';
import { ReservationPssService } from '@module/pss/reservation/reservation.service';
import { VoucherTypePssService } from '@module/pss/voucher-type/voucher-type.service';
import { VoucherDTO } from '@module/pss/voucher/dtos/voucher.dto';
import { VoucherPssService } from '@module/pss/voucher/voucher.service';
import { VoucherTypeService } from '@module/voucher-type/voucher-type.service';
import { MailService } from '@shared/services/mail.service';
import { ClaimVoucher, ClaimVoucherQuery } from './dtos/claim-voucher';
import { GetClaimVoucherResponse } from './dtos/claim-voucher-response';

@Injectable()
export class VoucherService {
  constructor(
    private readonly reservationPssService: ReservationPssService,
    private readonly voucherTypePssService: VoucherTypePssService,
    private readonly voucherPssService: VoucherPssService,
    private readonly mailService: MailService,
    private readonly voucherTypeService: VoucherTypeService,
    private readonly logger: AppLogger,
  ) {}
  public async getClaimVoucher(
    query: ClaimVoucherQuery,
  ): Promise<GetClaimVoucherResponse> {
    const voucherType = await this.voucherTypeService.getVoucherTypeById(
      query.voucherTypeId,
    );
    const reservation: ReservationByKeyDTO =
      await this.reservationPssService.getReservationByLocator(
        query.reservationLocator,
      );

    const availableVoucher = {};
    if (voucherType.name === 'GoodWill') {
      const journeys = reservation.journeys.filter(
        (journey) => journey.reservationStatus.cancelled === true,
      );
      journeys.forEach((journey) => {
        availableVoucher[journey.key] = true;
      });
    } else if (voucherType.name === 'TravelPass') {
      reservation.ancillaryPurchases.forEach((ancillary) => {
        if (ancillary['key'] === 'TEMP') {
          availableVoucher[ancillary.journey.key] = {
            [ancillary.passenger.key]: true,
          };
        }
      });
    }
    return { reservation, availableVoucher };
  }

  public async claimVoucher(body: ClaimVoucher): Promise<VoucherDTO[]> {
    const reservation: ReservationByKeyDTO =
      await this.reservationPssService.getReservationByLocator(
        body.reservationLator,
      );

    const cancleFlight = reservation.journeys.filter(
      (journey) => journey.reservationStatus.cancelled,
    );

    const email =
      reservation.passengers[0].reservationProfile.personalContactInformation
        .email;

    if (cancleFlight.length > 0) {
      const passengers: any[] = reservation.passengers.map((passenger) => {
        return {
          email,
          firstName: passenger.reservationProfile.firstName,
          lastName: passenger.reservationProfile.lastName,
        };
      });
      const voucherType = await this.voucherTypeService.getVoucherTypeById(
        body.voucherTypeId,
      );

      const currentDate = new Date();
      currentDate.setFullYear(currentDate.getFullYear() + 1);
      const redeemVoucher: CreateVoucherDTO = {
        voucherType: voucherType.voucherPssType,

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

      const generateVoucher =
        await this.voucherPssService.generaVoucherWithIdentifier(
          redeemVoucher,
          passengers,
        );

      // TODP :SEND EMAIL
      await this.mailService.sendEmailVoucherClaim({
        email,
        vouchers: generateVoucher,
      });

      return generateVoucher;
    }
    return null;
  }
}
