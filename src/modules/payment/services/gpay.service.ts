import { OrderEntity } from '@common/entities';
import { PaymentTransactionEntity } from '@common/entities/payment-transaction.entity';
import { AppException } from '@common/exceptions/app-exception';
import { GPAY_REQUEST_ERROR, INVALID_DATA } from '@common/exceptions/error';
import { AppLogger } from '@common/logger/logger.service';
import { generateRequestId } from '@common/utils';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectEntityManager } from '@nestjs/typeorm';
import { GPayHttpService } from '@shared/services';
import BigNumber from 'bignumber.js';
import * as moment from 'moment';
import { EntityManager } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { PaymentResponseDto } from '../dtos/payment.dto';
import { IGpayRequest, IGpayResponse } from '../interfaces/gpay.interface';

@Injectable()
export class GpayService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    private readonly logger: AppLogger,
    private readonly config: ConfigService,
    private readonly gpayHttpService: GPayHttpService,
  ) {
    this.logger.setContext(GpayService.name);
  }

  @Transactional()
  async gpayPayment(
    order: OrderEntity,
    transaction: PaymentTransactionEntity,
  ): Promise<PaymentResponseDto> {
    if (!order || !transaction) {
      throw new AppException(INVALID_DATA, {
        message: 'Order or transaction not found',
      });
    }
    const gpayRequest: IGpayRequest = {
      requestID: generateRequestId(),
      requestDateTime: +moment(new Date()).format('YYYYMMDDHHMMSS'),
      requestData: {
        apiOperation: this.config.get('GPAY_OPERATION'),
        orderID: order.orderId.toString(),
        orderAmount: BigNumber(transaction.amount)
          .plus(transaction.paymentFee)
          .toNumber(),
        orderCurrency: this.config.get('PAYMENT_CURRENCY'),
        orderDateTime: +moment(order.createdAt).format('YYYYMMDDHHMMSS'),
        orderDescription: this.config.get('PAYMENT_DESCRIPTION'),
        language: this.config.get('PAYMENT_LANGUAGE'),
        successURL: `${this.config.get('GPAY_SUCCESS_URL')}?paymentKey=${
          order.paymentKey
        }&orderId=${order.orderId}`,
        failureURL: `${this.config.get('GPAY_FAILURE_URL')}?orderId=${
          order.orderId
        }`,
        cancelURL: `${this.config.get('GPAY_CANCEL_URL')}?orderId=${
          order.orderId
        }`,
      },
    };

    const request: any = await this.gpayHttpService.post(
      this.config.get('GPAY_PAYMENT_ACTION'),
      gpayRequest,
    );

    const response: IGpayResponse = request.data;

    if (response.responseCode !== '200') {
      this.logger.error(
        `GPAY request error | requestId: ${response.requestID} | message: ${response.responseMessage}`,
      );
      throw new AppException(GPAY_REQUEST_ERROR);
    }

    await this.entityManager
      .getRepository(PaymentTransactionEntity)
      .update(transaction.id, {
        txnResponseCode: response.responseData.transactionID,
        message: response.responseMessage,
        paymentInfo: JSON.stringify(response),
      });

    return {
      transactionId: response.responseData.transactionID,
      endpoint: response.responseData.endpoint,
    };
  }
}
