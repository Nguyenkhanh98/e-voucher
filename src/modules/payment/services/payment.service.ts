import {
  ItemType,
  OrderEntity,
  OrderStatus,
  VoucherPssTypeBrief,
  VoucherTypeEntity,
} from '@common/entities';
import {
  PaymentMethod,
  PaymentStatus,
  PaymentTransactionEntity,
} from '@common/entities/payment-transaction.entity';
import { AppException } from '@common/exceptions/app-exception';
import {
  INVALID_DATA,
  MISSING_PASSENGER_INFO,
  ORDER_LOCKED,
  ORDER_NOT_FOUND,
  TRANSACTION_NOT_FOUND,
} from '@common/exceptions/error';
import { AppLogger } from '@common/logger/logger.service';
import { OrderItemQuotationDto } from '@module/order/dtos/quotation.dto';
import {
  CreateVoucherDTO,
  VoucherGeneratedDTO,
} from '@module/pss/voucher/dtos';
import { VoucherPssService } from '@module/pss/voucher/voucher.service';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { first, last } from 'lodash';
import { EntityManager, In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmPaymentDto, PaymentResponseDto } from '../dtos/payment.dto';
import { GpayService } from './gpay.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    private readonly logger: AppLogger,
    private readonly gpayService: GpayService,
    private readonly voucherPssService: VoucherPssService,
  ) {
    this.logger.setContext(PaymentService.name);
  }

  @Transactional()
  async createTransaction(
    order: OrderEntity,
    totalAmount: string,
  ): Promise<PaymentResponseDto> {
    if (!order || !totalAmount) {
      throw new AppException(INVALID_DATA, {
        messsage: 'Create transaction | Order or total amount not found',
      });
    }
    const transaction = await this.entityManager
      .getRepository(PaymentTransactionEntity)
      .create({
        transactionId: uuidv4(),
        orderId: order.orderId,
        amount: totalAmount,
        // TODO: handle payment fee
        paymentFee: '0',
        paymentMethod: PaymentMethod.GPAY,
      })
      .save();

    let paymentResponse: PaymentResponseDto;

    switch (transaction.paymentMethod) {
      case PaymentMethod.GPAY:
        paymentResponse = await this.gpayService.gpayPayment(
          order,
          transaction,
        );
        break;
      default:
        paymentResponse = await this.gpayService.gpayPayment(
          order,
          transaction,
        );
    }

    return paymentResponse;
  }

  async confirmPayment(confirmData: ConfirmPaymentDto) {
    const order = await this.entityManager.getRepository(OrderEntity).findOne({
      where: {
        orderId: confirmData.orderId,
      },
      relations: ['orderItems'],
    });

    if (!order) {
      throw new AppException(ORDER_NOT_FOUND);
    }

    if (order.status !== OrderStatus.ACTIVE) {
      throw new AppException(ORDER_LOCKED);
    }

    const transaction = await this.entityManager
      .getRepository(PaymentTransactionEntity)
      .findOne({
        where: {
          orderId: order.orderId,
        },
        order: {
          createdAt: 'DESC',
        },
      });

    if (!transaction) {
      throw new AppException(TRANSACTION_NOT_FOUND);
    }

    if (confirmData.paymentKey) {
      transaction.status = PaymentStatus.SUCCESS;
      order.status = OrderStatus.SUCCESS;
    } else {
      transaction.status = PaymentStatus.FAILED;
      order.status = OrderStatus.FAILED;
    }

    await this.entityManager.transaction(async (entity) => {
      await Promise.all([entity.save(transaction), entity.save(order)]);
    });

    const voucherData = await this.handleGenerateVoucher(order);
    return {
      transactionStatus: transaction.status,
      order: order,
      amount: transaction.amount,
      voucherData,
    };
  }

  private async handleGenerateVoucher(order: OrderEntity) {
    try {
      // Get voucher pss
      const voucherIds = new Set();

      order.orderItems.forEach((item) => {
        if (item.metadata) {
          item.metadata.forEach((metaItem: OrderItemQuotationDto) => {
            voucherIds.add(metaItem.voucherType);
          });
        }
      });

      const voucherPss = await this.entityManager
        .getRepository(VoucherTypeEntity)
        .find({
          where: {
            id: In(Array.from(voucherIds.values())),
          },
        });

      const mapVoucherPss = new Map<number, VoucherPssTypeBrief>();

      voucherPss.forEach((voucher) =>
        mapVoucherPss.set(voucher.id, voucher.voucherPssType),
      );

      // Generate voucher step
      const generateVouchersMap = new Map<number, CreateVoucherDTO[]>();

      order.orderItems.forEach((item) => {
        switch (item.itemType) {
          case ItemType.PRODUCT:
            const productMeta = last(item.metadata) as OrderItemQuotationDto;
            const generateVoucher =
              generateVouchersMap.get(productMeta.voucherType) || [];
            const voucherPss = mapVoucherPss.get(productMeta.voucherType);

            generateVoucher.push({
              voucherType: {
                href: voucherPss.href,
                key: voucherPss.key,
                name: voucherPss.name,
              },
              generationNumber:
                productMeta.quantity + productMeta.promotion.quantity,
              autoGeneratePersonalIdentificationNumber: {
                length: 4,
              },
              autoGeneratePassword: {
                length: 6,
              },
              expiryDate: productMeta.endUseDate,
              available: productMeta.quantity + productMeta.promotion.quantity,
              reason: productMeta.name,
            });
            break;
          case ItemType.CAMPAIGN:
            const campaignMetadata = item.metadata as OrderItemQuotationDto[];
            campaignMetadata.forEach((metaItem) => {
              const generate =
                generateVouchersMap.get(productMeta.voucherType) || [];
              const voucher = mapVoucherPss.get(productMeta.voucherType);

              generate.push({
                voucherType: {
                  href: voucher.href,
                  key: voucher.key,
                  name: voucher.name,
                },
                generationNumber:
                  metaItem.quantity + metaItem.promotion.quantity,
                autoGeneratePersonalIdentificationNumber: {
                  length: 4,
                },
                autoGeneratePassword: {
                  length: 6,
                },
                expiryDate: metaItem.endUseDate,
                available: metaItem.quantity + metaItem.promotion.quantity,
                reason: metaItem.name,
              });
            });
            break;
          default:
            break;
        }
      });

      const valueGenerateVouchers = Array.from(generateVouchersMap.values());

      const generateResultRequest = await Promise.all(
        valueGenerateVouchers.map((item) => {
          return Promise.all(
            item.map((voucherItem) => {
              return this.voucherPssService.generateVouchers(voucherItem);
            }),
          );
        }),
      );

      const generateResult = generateResultRequest.flat();

      /**
       * key: 'voucherType-expiryDate' to group voucher result by type and expiryDate
       * value: voucher generate in pss result
       */
      const mapGenerateVoucherInfo = new Map<string, VoucherGeneratedDTO[]>();

      valueGenerateVouchers.forEach((item, index) => {
        const firstItem = first(item);
        if (firstItem) {
          generateResult[index].forEach((result) => {
            const generateMapItem =
              mapGenerateVoucherInfo.get(
                `${firstItem.voucherType}-${firstItem.expiryDate}`,
              ) || [];
            generateMapItem.push(result);
          });
        }
      });

      // Update passenger info to voucher result step
      order.orderItems.forEach((item) => {
        switch (item.itemType) {
          case ItemType.PRODUCT:
            const productMeta = last(item.metadata) as OrderItemQuotationDto;
            const generateMapItem = mapGenerateVoucherInfo.get(
              `${productMeta.voucherType}-${productMeta.endUseDate}`,
            );

            if (productMeta.passengers.length !== generateMapItem.length) {
              throw new AppException(MISSING_PASSENGER_INFO);
            }

            productMeta.passengers.forEach((passenger, index) => {
              generateMapItem[
                index
              ].passengerName = `${passenger.lastName} ${passenger.firstName}`;
            });

            break;
          case ItemType.CAMPAIGN:
            const campaignMetadata = item.metadata as OrderItemQuotationDto[];
            campaignMetadata.forEach((metaItem) => {
              const generateItem = mapGenerateVoucherInfo.get(
                `${productMeta.voucherType}-${productMeta.endUseDate}`,
              );

              if (metaItem.passengers.length !== generateItem.length) {
                throw new AppException(MISSING_PASSENGER_INFO);
              }

              metaItem.passengers.forEach((passenger, index) => {
                generateItem[
                  index
                ].passengerName = `${passenger.lastName} ${passenger.firstName}`;
              });
            });
            break;
          default:
            break;
        }
      });

      // Request to update passenger info voucher
      const vouchersInfo = Array.from(mapGenerateVoucherInfo.values()).flat();
      await Promise.all(
        vouchersInfo.map((item) => {
          return this.voucherPssService.updateVoucher(item.key, {
            passengerName: item.passengerName,
          });
        }),
      );

      return vouchersInfo;
    } catch (error) {
      this.logger.error(error.messsage);
      return undefined;
    }
  }
}
