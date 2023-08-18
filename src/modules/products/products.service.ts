import { ItemType, ProductEntity, VoucherTypeEntity } from '@common/entities';
import { Injectable } from '@nestjs/common';

import { AppException } from '@common/exceptions/app-exception';
import {
  INVALID_DATA,
  PRODUCT_ITEM_INVALID,
  PRODUCT_ITEM_NOT_ACTIVE,
  PRODUCT_ITEM_NOT_FOUND,
  PRODUCT_NOT_FOUND,
  PRODUCT_REMAIN_QUANTITY_NOT_ENOUGH,
  VOUCHER_TYPE_NOT_EXIST,
} from '@common/exceptions/error';
import { AppLogger } from '@common/logger/logger.service';
import { mapPlainToEntity } from '@helpers/entity.helper';
import { numberHelper } from '@helpers/index';
import { OrderItemDto } from '@module/order/dtos/order.dto';
import { QuotationResponseDto } from '@module/order/dtos/quotation.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import BigNumber from 'bignumber.js';
import { last } from 'lodash';
import { Brackets, EntityManager, In, Repository } from 'typeorm';
import { CreateProductDTO, UpdateProductDTO } from './dtos';
import { GetProductQuery } from './dtos/query-product';
import { isNumeric } from '@common/utils';
import { FilterOperator, PaginateQuery, paginate } from 'nestjs-paginate';

@Injectable()
export class ProductService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(VoucherTypeEntity)
    private readonly voucherTypeRepository: Repository<VoucherTypeEntity>,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(ProductEntity.name);
  }

  async getProducts(query: PaginateQuery) {
    const products = await paginate(query, this.productRepository, {
      sortableColumns: ['id', 'createdAt', 'updatedAt'],
      nullSort: 'last',
      defaultSortBy: [['createdAt', 'DESC']],
      filterableColumns: {
        id: [FilterOperator.EQ],
        name: [FilterOperator.EQ, FilterOperator.ILIKE],
        nameEn: [FilterOperator.EQ, FilterOperator.ILIKE],
        startDate: [FilterOperator.GTE, FilterOperator.NULL],
        endDate: [FilterOperator.LTE, FilterOperator.NULL],
        startUseDate: [FilterOperator.GTE, FilterOperator.NULL],
        endUseDate: [FilterOperator.LTE, FilterOperator.NULL],
        'voucherType.groupType': [
          FilterOperator.EQ,
          FilterOperator.ILIKE,
          FilterOperator.NULL,
        ],
        discount: [FilterOperator.EQ, FilterOperator.ILIKE],
        active: [FilterOperator.EQ],
        createdAt: [FilterOperator.BTW],
        updatedAt: [FilterOperator.BTW],
      },
      relations: ['voucherType'],
    });

    return products;
  }

  async getAllProducts(condition: GetProductQuery = {}) {
    const queryBuilder = this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.voucherType', 'voucherType');

    if (condition.groupType) {
      queryBuilder.where('voucherType.groupType = :voucherType', {
        voucherType: condition.groupType,
      });
    }

    if (condition.active) {
      queryBuilder.where({ active: condition.active });
    }
    queryBuilder.relation('voucherType');
    return await queryBuilder.getMany();
  }

  async getProductById(id: number | string): Promise<ProductEntity> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .where(
        new Brackets((query) => {
          if (isNumeric(id)) {
            query.where('product.id = :id', { id });
          } else {
            query.where('product.slugKey = :id', { id });
          }
        }),
      )
      .leftJoinAndSelect('product.voucherType', 'voucherType')
      .getOne();

    return product;
  }

  async createProduct(newData: CreateProductDTO): Promise<ProductEntity> {
    const paritialProduct = mapPlainToEntity(ProductEntity, newData);
    const voucherType = await this.voucherTypeRepository.findOne({
      where: {
        id: newData.voucherTypeId,
      },
    });

    if (!voucherType) {
      throw new AppException(VOUCHER_TYPE_NOT_EXIST);
    }

    const product = this.productRepository.create({
      ...paritialProduct,
      active: false,
    });
    product.voucherType = voucherType;

    const createdEntity = await this.productRepository.save(product);
    return createdEntity;
  }

  async deleteProductById(id: string) {
    const products = await this.productRepository.update(id, {
      active: false,
    });
    return products;
  }

  async updateProductById(
    id: number,
    updateData: UpdateProductDTO,
  ): Promise<ProductEntity> {
    const findProduct = await this.productRepository.findOne({
      where: { id: id },
    });

    if (!findProduct) {
      throw new AppException(PRODUCT_NOT_FOUND);
    }

    const updatedEntity = await this.productRepository
      .create({
        ...findProduct,
        ...updateData,
      })
      .save();

    return updatedEntity;
  }

  async getPricesProducts(products: [{ id: number; amount: number }]): Promise<{
    quotations: {
      totalAmount: string;
      bonus: number;
    }[];
    totalAmount: string;
  }> {
    const ids = products.map((product) => {
      return {
        id: product.id,
        active: true,
      };
    });
    const productsFound = await this.productRepository.findBy(ids);

    if (productsFound.length !== products.length) {
      throw new AppException(INVALID_DATA);
    }

    let totalAmount = '0';

    const quotations = productsFound.map((product, idx) => {
      const amount = products[idx].amount;
      const currentProductPrice = BigNumber.max(
        BigNumber(product.price).minus(product.discount || '0'),
        '0',
      );

      let numberBonus = 0;
      if (product.promotion) {
        const { numerator, denominator } = numberHelper.getDecimalFraction(
          product.promotion,
        );
        numberBonus = Math.floor(amount / numerator) * denominator;
      }

      const currentProductTotalAmount =
        BigNumber(currentProductPrice).multipliedBy(amount);
      totalAmount = BigNumber(totalAmount)
        .plus(currentProductTotalAmount)
        .toString();
      return {
        totalAmount: BigNumber(currentProductTotalAmount).toFixed(3),
        bonus: numberBonus,
      };
    });

    return {
      totalAmount: BigNumber(totalAmount).toFixed(3),
      quotations,
    };
  }

  async quotationProducts(
    orderItems: OrderItemDto[],
  ): Promise<QuotationResponseDto> {
    const itemIds = orderItems.flatMap((item) => item.itemId);
    const products: ProductEntity[] = await this.entityManager
      .getRepository(ProductEntity)
      .find({ where: { id: In(itemIds) } });

    // Set product to map
    const productsMap = new Map<number, ProductEntity>();
    products.forEach((product) => {
      productsMap.set(product.id, product);
    });

    const result: QuotationResponseDto = {
      items: [],
      totalAmount: '0',
    };

    // Handle quotation
    orderItems.forEach((orderItem) => {
      const productItem = productsMap.get(orderItem.itemId);
      if (!productItem) {
        throw new AppException(PRODUCT_ITEM_NOT_FOUND, {
          orderId: orderItem.itemId,
          message: 'Not found product by item id',
        });
      }

      if (productItem.limit - orderItem.quantity < productItem.used) {
        throw new AppException(PRODUCT_REMAIN_QUANTITY_NOT_ENOUGH, {
          productId: productItem.id,
          orderQuantity: orderItem.quantity,
          remainQuantity: productItem.limit - productItem.used,
        });
      }

      if (!productItem.active) {
        throw new AppException(PRODUCT_ITEM_NOT_ACTIVE, {
          orderId: orderItem.itemId,
        });
      }

      const dateNow = Date.now();
      if (
        dateNow < productItem.startDate.getTime() ||
        dateNow > productItem.endDate.getTime()
      ) {
        throw new AppException(PRODUCT_ITEM_INVALID, {
          orderId: orderItem.itemId,
          startDateValid: productItem.startDate,
          endDateValid: productItem.endDate,
        });
      }

      result.items.push({
        itemId: orderItem.itemId,
        name: productItem.name,
        type: ItemType.PRODUCT,
        quantity: orderItem.quantity,
        price: productItem.price,
        discount: productItem.discount,
        voucherType: productItem.voucherTypeId,
        endUseDate: productItem.endUseDate,
        promotion:
          productItem.promotion !== 0
            ? {
                itemId: orderItem.itemId,
                name: productItem.name,
                quantity: Math.floor(
                  orderItem.quantity / productItem.promotion,
                ),
                price: '0',
                discount: '0',
                totalAmount: '0',
                type: ItemType.PRODUCT,
                promotion: undefined,
                detail: undefined,
              }
            : undefined,
        totalAmount: BigNumber.max(
          BigNumber(productItem.price)
            .multipliedBy(orderItem.quantity)
            .minus(
              BigNumber(productItem.discount).multipliedBy(orderItem.quantity),
            ),
          0,
        ).toFixed(3),
        detail: undefined,
      });

      result.totalAmount = BigNumber(result.totalAmount)
        .plus(last(result.items)?.totalAmount || 0)
        .toFixed(3);
    });

    return result;
  }
}
