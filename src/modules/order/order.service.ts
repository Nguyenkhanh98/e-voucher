import {
  CustomerEntity,
  CustomerStatus,
  ItemType,
  OrderEntity,
  OrderItemEntity,
  OrderStatus,
} from '@common/entities';
import { AppException } from '@common/exceptions/app-exception';
import {
  ITTEM_TYPE_NOT_SUPPORT,
  MISSING_PASSENGER_INFO,
  ORDER_AMOUNT_INVALID,
  ORDER_ITEM_CAN_NOT_BE_EMPTY,
  ORDER_NOT_FOUND,
} from '@common/exceptions/error';
import { AppLogger } from '@common/logger/logger.service';
import { generateOrderId, generatePaymentKey } from '@common/utils';
import { CampaignService } from '@module/campaign/campaign.service';
import { PaymentResponseDto } from '@module/payment/dtos/payment.dto';
import { PaymentService } from '@module/payment/services/payment.service';
import { ProductService } from '@module/products/products.service';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { MailService } from '@shared/services/mail.service';
import BigNumber from 'bignumber.js';
import { get, groupBy } from 'lodash';
import { EntityManager } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { v4 as uuidv4 } from 'uuid';
import {
  ConfirmOrderDto,
  ConfirmOrderItemDto,
  CustomerInfoDto,
  OrderItemDto,
} from './dtos/order.dto';
import {
  OrderItemQuotationDto,
  QuotationDto,
  QuotationResponseDto,
} from './dtos/quotation.dto';
import {
  FilterOperator,
  FilterSuffix,
  PaginateQuery,
  paginate,
} from 'nestjs-paginate';
import { PaymentTransactionEntity } from '@common/entities/payment-transaction.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    private readonly logger: AppLogger,
    private readonly paymentService: PaymentService,
    private readonly emailService: MailService,
    private readonly productService: ProductService,
    private readonly campaignService: CampaignService,
  ) {
    this.logger.setContext(OrderService.name);
  }

  async getOrders(query: PaginateQuery) {
    const queryBuilder = this.entityManager
      .getRepository(OrderEntity)
      .createQueryBuilder('order')
      .leftJoinAndMapOne(
        'order.customer',
        CustomerEntity,
        'customer',
        'order.customerId = customer.id',
      );

    const result = await paginate(query, queryBuilder, {
      sortableColumns: [
        'createdAt',
        'status',
        'customerId',
        'orderId',
        'id',
        'updatedAt',
      ],
      nullSort: 'last',
      defaultSortBy: [['createdAt', 'DESC']],
      filterableColumns: {
        id: [FilterOperator.EQ],
        orderId: [FilterOperator.ILIKE, FilterOperator.EQ],
        customerId: [FilterOperator.EQ],
        status: [FilterOperator.EQ, FilterSuffix.NOT],
        createdAt: [FilterOperator.BTW],
        updatedAt: [FilterOperator.BTW],
      },
    });

    return result;
  }

  async getInfoOrder(id: number) {
    const order = await this.entityManager
      .getRepository(OrderEntity)
      .createQueryBuilder('order')
      .leftJoinAndMapOne(
        'order.customer',
        CustomerEntity,
        'customer',
        'order.customerId = customer.id',
      )
      .leftJoinAndMapMany(
        'order.orderItems',
        OrderItemEntity,
        'orderItem',
        'order.orderId = orderItem.orderId',
      )
      .leftJoinAndMapMany(
        'order.paymentTransactions',
        PaymentTransactionEntity,
        'paymentTransaction',
        'order.orderId = paymentTransaction.orderId',
      )
      .where('order.id = :id', { id })
      .getOne();

    if (!order) {
      throw new AppException(ORDER_NOT_FOUND);
    }

    return order;
  }

  async quotationOrder(
    quotationData: QuotationDto,
  ): Promise<QuotationResponseDto> {
    const itemIds = quotationData.orderItems.flatMap((item) => item.itemId);

    if (itemIds.length === 0) {
      throw new AppException(ORDER_ITEM_CAN_NOT_BE_EMPTY);
    }

    const groupOrder = groupBy(quotationData.orderItems, 'type');
    const [quotationProducts, quotationCampaigns] = await Promise.all([
      this.productService.quotationProducts(groupOrder[ItemType.PRODUCT]),
      this.campaignService.quotationCampaigns(groupOrder[ItemType.CAMPAIGN]),
    ]);

    return {
      items: [...quotationCampaigns.items, ...quotationProducts.items],
      totalAmount: BigNumber(quotationCampaigns.totalAmount)
        .plus(quotationProducts.totalAmount)
        .toFixed(3),
    };
  }

  @Transactional()
  async confirmOrder(orderData: ConfirmOrderDto): Promise<PaymentResponseDto> {
    const quotationOrder = await this.quotationOrder({
      orderItems: orderData.orderItems,
    });

    if (quotationOrder.totalAmount !== orderData.totalAmount) {
      throw new AppException(ORDER_AMOUNT_INVALID, {
        totalAmount: orderData.totalAmount,
        totalAmountValid: quotationOrder.totalAmount,
      });
    }

    this.validateOrderPassengers(orderData.orderItems, quotationOrder);

    const customer = await this.handleCustomerOrder(orderData.customerInfo);

    // Create order and order item
    const order = await this.entityManager
      .getRepository(OrderEntity)
      .create({
        orderId: generateOrderId(),
        status: OrderStatus.ACTIVE,
        customerId: customer.id,
        paymentKey: generatePaymentKey(),
      })
      .save();

    // Compare passenger to order item meta data
    const mapOrderItem = new Map<string, ConfirmOrderItemDto>();

    orderData.orderItems.forEach((item) => {
      mapOrderItem.set(`${item.type}-${item.itemId}`, item);
    });

    quotationOrder.items.forEach((item) => {
      switch (item.type) {
        case ItemType.PRODUCT:
          const productItem = mapOrderItem.get(`${item.type}-${item.itemId}`);
          item.passengers = productItem.passengers.flatMap(
            (passenger) => passenger.passengersInfo,
          );
          break;
        case ItemType.CAMPAIGN:
          const campaignItem = mapOrderItem.get(`${item.type}-${item.itemId}`);
          if (item.detail && item.detail.length > 0) {
            item.detail.forEach((campaignProductItem) => {
              const passengerProduct = campaignItem.passengers.filter(
                (passenger) => passenger.itemId === campaignProductItem.itemId,
              );

              campaignProductItem.passengers = passengerProduct.flatMap(
                (passenger) => passenger.passengersInfo,
              );
            });
          }
          break;
        default:
          throw new AppException(ITTEM_TYPE_NOT_SUPPORT);
      }
    });

    const orderItems = quotationOrder.items.map((item) => {
      return {
        orderId: order.orderId,
        itemId: item.itemId,
        itemType: item.type,
        quantity: item.quantity,
        price: item.price,
        totalAmount: item.totalAmount,
        discount: item.discount,
        metadata: item.type === ItemType.PRODUCT ? [item] : item.detail,
      } as OrderItemEntity;
    });

    await this.entityManager
      .getRepository(OrderItemEntity)
      .save([...orderItems]);

    const paymentResponse = await this.paymentService.createTransaction(
      order,
      quotationOrder.totalAmount,
    );
    return paymentResponse;
  }

  private validateOrderPassengers(
    orderItemData: ConfirmOrderItemDto[],
    quotationData: QuotationResponseDto,
  ): void {
    const mapOrderItem = new Map<string, OrderItemQuotationDto>();

    quotationData.items.forEach((item) => {
      mapOrderItem.set(`${item.type}-${item.itemId}`, item);
    });

    orderItemData.forEach((item) => {
      switch (item.type) {
        case ItemType.PRODUCT:
          const productItem = mapOrderItem.get(`${item.type}-${item.itemId}`);
          const promotionQuantity = get(productItem, 'promotion.quantity', 0);
          if (
            item.passengers.length !==
            productItem.quantity + promotionQuantity
          ) {
            throw new AppException(MISSING_PASSENGER_INFO, {
              itemId: item.itemId,
              itemQuantity: productItem.quantity,
              promotionQuantity: promotionQuantity,
              passengersLength: item.passengers.length,
            });
          }
          break;
        case ItemType.CAMPAIGN:
          const campaignItem = mapOrderItem.get(`${item.type}-${item.itemId}`);
          const orderItemGroup = groupBy(item.passengers, 'itemId');
          campaignItem.detail.forEach((campaignItem) => {
            const promotionQuantity = get(
              campaignItem,
              'promotion.quantity',
              0,
            );
            if (
              orderItemGroup[campaignItem.itemId].length !==
              campaignItem.quantity + promotionQuantity
            ) {
              throw new AppException(MISSING_PASSENGER_INFO, {
                itemId: item.itemId,
                itemQuantity: campaignItem.quantity,
                promotionQuantity: promotionQuantity,
                passengersLength: item.passengers.length,
              });
            }
          });
          break;
        default:
          throw new AppException(ITTEM_TYPE_NOT_SUPPORT);
      }
    });
  }

  @Transactional()
  private async handleCustomerOrder(
    customerData: CustomerInfoDto,
  ): Promise<CustomerEntity> {
    const findCustomer = await this.entityManager
      .getRepository(CustomerEntity)
      .findOne({ where: { email: customerData.email } });

    if (findCustomer) {
      return findCustomer;
    }

    const newCustomer = await this.entityManager
      .getRepository(CustomerEntity)
      .create({
        email: customerData.email,
        lastName: customerData.lastName,
        firstName: customerData.firstName,
        phone: customerData.phone,
        status: CustomerStatus.NEW,
        activeKey: uuidv4(),
      })
      .save();

    // Send email active customer
    this.emailService.sendEmailActiveCustomer(newCustomer);

    return newCustomer;
  }
}
