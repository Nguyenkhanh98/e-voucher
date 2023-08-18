import { ItemType, ProductEntity } from '@common/entities';
import { CampaignItemEntity } from '@common/entities/campaign-item.entity';
import { CampaignEntity } from '@common/entities/campaign.entity';
import { AppException } from '@common/exceptions/app-exception';
import {
  CAMPAIGN_DISCOUNT_INVALID,
  CAMPAIGN_EXIST,
  CAMPAIGN_INVALID,
  CAMPAIGN_NOT_FOUND,
  CAMPAIGN_REMAIN_QUANTITY_NOT_ENOUGH,
  PRODUCT_INVALID,
  PRODUCT_ITEM_NOT_ACTIVE,
} from '@common/exceptions/error';
import { AppLogger } from '@common/logger/logger.service';
import { OrderItemDto } from '@module/order/dtos/order.dto';
import { QuotationResponseDto } from '@module/order/dtos/quotation.dto';
import { ProductService } from '@module/products/products.service';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import BigNumber from 'bignumber.js';
import { cloneDeep, last } from 'lodash';
import { FilterOperator, PaginateQuery, paginate } from 'nestjs-paginate';
import { Brackets, EntityManager, In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import {
  CampaignDto,
  CampaignItemDto,
  UpdateCampaignDto,
} from './dtos/campaign.dto';
import { isNumeric } from '@common/utils';

@Injectable()
export class CampaignService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    private readonly logger: AppLogger,
    private readonly productService: ProductService,
  ) {
    this.logger.setContext(CampaignService.name);
  }

  async getCampaigns(query: PaginateQuery) {
    const queryBuilder = this.entityManager
      .getRepository(CampaignEntity)
      .createQueryBuilder('campaign')
      .leftJoinAndMapMany(
        'campaign.campaignItems',
        CampaignItemEntity,
        'campaignItem',
        'campaign.id = campaignItem.campaignId',
      )
      .leftJoinAndMapOne(
        'campaignItem.product',
        ProductEntity,
        'product',
        'campaignItem.productId = product.id',
      )
      .select([
        'campaign',
        'campaignItem.quantity',
        'product.id',
        'product.name',
        'product.price',
        'product.active',
        'product.discount',
        'product.promotion',
        'product.startDate',
        'product.endDate',
      ]);

    const campaigns = await paginate(query, queryBuilder, {
      sortableColumns: ['id', 'createdAt', 'updatedAt'],
      nullSort: 'last',
      defaultSortBy: [['createdAt', 'DESC']],
      filterableColumns: {
        id: [FilterOperator.EQ],
        name: [FilterOperator.EQ, FilterOperator.ILIKE, FilterOperator.NULL],
        description: [FilterOperator.ILIKE, FilterOperator.NULL],
        startDate: [FilterOperator.GTE, FilterOperator.NULL],
        endDate: [FilterOperator.LTE, FilterOperator.NULL],
        discount: [FilterOperator.EQ, FilterOperator.ILIKE],
        active: [FilterOperator.EQ],
        createdAt: [FilterOperator.BTW],
        updatedAt: [FilterOperator.BTW],
      },
    });

    campaigns.data = campaigns.data.map((item) => {
      return {
        ...item,
        totalAmount: this.getPriceCampaign(item.campaignItems, item.discount),
      } as any;
    });

    return campaigns;
  }

  async getInfoCampaign(campaignId: string | number) {
    const findCampaign = await this.entityManager
      .getRepository(CampaignEntity)
      .createQueryBuilder('campaign')
      .leftJoinAndMapMany(
        'campaign.campaignItems',
        CampaignItemEntity,
        'campaignItem',
        'campaign.id = campaignItem.campaignId',
      )
      .leftJoinAndMapOne(
        'campaignItem.product',
        ProductEntity,
        'product',
        'campaignItem.productId = product.id',
      )
      .where(
        new Brackets((query) => {
          if (isNumeric(campaignId)) {
            query.where('campaign.id = :id', { id: campaignId });
          } else {
            query.where('campaign.slugKey = :slugKey', { slugKey: campaignId });
          }
        }),
      )
      .select([
        'campaign',
        'campaignItem.quantity',
        'product.id',
        'product.name',
        'product.price',
        'product.active',
        'product.discount',
        'product.promotion',
        'product.startDate',
        'product.endDate',
      ])
      .getOne();

    if (!findCampaign) {
      throw new AppException(CAMPAIGN_NOT_FOUND);
    }

    // Get total amount campaign
    const totalAmount = this.getPriceCampaign(
      findCampaign.campaignItems,
      findCampaign.discount,
    );

    return { ...findCampaign, totalAmount };
  }

  @Transactional()
  async createCampaign(createData: CampaignDto) {
    const findCampaign = await this.entityManager
      .getRepository(CampaignEntity)
      .findOne({ where: { name: createData.name } });

    if (findCampaign) {
      throw new AppException(CAMPAIGN_EXIST);
    }

    if (createData.startDate.getTime() > createData.endDate.getTime()) {
      throw new AppException(CAMPAIGN_INVALID, {
        details: 'startDate can not be greater than endDate',
      });
    }

    const campaign = await this.entityManager
      .getRepository(CampaignEntity)
      .create({
        ...createData,
        active: true,
      })
      .save();

    if (createData.items && createData.items.length > 0) {
      const productIds = createData.items.flatMap((product) => product.itemId);
      const products = await this.entityManager
        .getRepository(ProductEntity)
        .find({ where: { id: In(productIds) } });

      if (products.length !== productIds.length) {
        throw new AppException(PRODUCT_INVALID);
      }

      // Validate campaign disscount and total product
      this.validateCampaignDisscount(
        products,
        campaign.discount,
        createData.items,
      );

      const campaignItems = await this.entityManager
        .getRepository(CampaignItemEntity)
        .save(
          createData.items.map((item) => {
            return {
              productId: item.itemId,
              quantity: item.quantity,
              campaignId: campaign.id,
            };
          }),
        );
      campaign.campaignItems = campaignItems;
    }

    return campaign;
  }

  @Transactional()
  async updateCampaign(campaignId: number, updateData: UpdateCampaignDto) {
    const findCampaign = await this.entityManager
      .getRepository(CampaignEntity)
      .findOne({ where: { id: campaignId } });

    if (!findCampaign) {
      throw new AppException(CAMPAIGN_NOT_FOUND);
    }

    const campaignItems = updateData.items;
    delete updateData.items;

    await this.entityManager
      .getRepository(CampaignEntity)
      .create({
        ...findCampaign,
        ...updateData,
      })
      .save();

    // update campaign item
    if (campaignItems && campaignItems.length > 0) {
      const currentItem = await this.entityManager
        .getRepository(CampaignItemEntity)
        .find({ where: { campaignId: campaignId } });

      const currentMap = new Map<number, CampaignItemEntity>();
      const updateMap = new Map<number, CampaignItemDto>();
      currentItem.forEach((item) => currentMap.set(item.productId, item));
      campaignItems.forEach((item) => updateMap.set(item.itemId, item));

      const deleteList: CampaignItemEntity[] = [];
      const updateList: CampaignItemEntity[] = [];
      const insertList: CampaignItemEntity[] = [];

      // check update and insert
      campaignItems.forEach((item) => {
        const findItemCurrent = currentMap.get(item.itemId);
        if (!findItemCurrent) {
          // case create
          insertList.push(
            this.entityManager.getRepository(CampaignItemEntity).create({
              campaignId: findCampaign.id,
              productId: item.itemId,
              quantity: item.quantity,
            }),
          );
        } else if (findItemCurrent.quantity !== item.quantity) {
          updateList.push({
            ...findItemCurrent,
            quantity: item.quantity,
          } as CampaignItemEntity);
        }
      });

      // check delete
      currentItem.forEach((item) => {
        const findUpdateItem = updateMap.get(item.productId);
        if (!findUpdateItem) {
          deleteList.push(item);
        }
      });

      const updateAndInsertProcess = this.entityManager
        .getRepository(CampaignItemEntity)
        .save([...updateList, ...insertList]);
      const deleteProcess = this.entityManager
        .getRepository(CampaignItemEntity)
        .remove(deleteList);

      // save data
      await Promise.all([updateAndInsertProcess, deleteProcess]);
    }

    const getInfoCampaign = await this.getInfoCampaign(campaignId);

    if (BigNumber(getInfoCampaign.totalAmount).isLessThan(0)) {
      throw new AppException(CAMPAIGN_DISCOUNT_INVALID);
    }

    return getInfoCampaign;
  }

  async updateStatusCampaign(campaignId: number, active: boolean) {
    const findCampaign = await this.entityManager
      .getRepository(CampaignEntity)
      .findOne({ where: { id: campaignId } });

    if (!findCampaign) {
      throw new AppException(CAMPAIGN_NOT_FOUND);
    }

    findCampaign.active = active;
    await findCampaign.save();

    return 'SUCCESS';
  }

  private getPriceCampaign(
    campaignItems: CampaignItemEntity[],
    discount: string,
  ) {
    if (campaignItems.length === 0) {
      return '0';
    }
    let totalAmount = '0';
    campaignItems.forEach((item) => {
      totalAmount = BigNumber(totalAmount)
        .plus(BigNumber(item.product.price).multipliedBy(item.quantity))
        .toString();
    });
    return BigNumber(totalAmount)
      .minus(discount || 0)
      .toFixed(3);
  }

  async quotationCampaigns(
    orderItems: OrderItemDto[],
  ): Promise<QuotationResponseDto> {
    const result: QuotationResponseDto = {
      items: [],
      totalAmount: '0',
    };

    if (!orderItems || (orderItems && orderItems.length === 0)) {
      return result;
    }

    const itemIds = orderItems.flatMap((item) => item.itemId);

    const campaigns: CampaignEntity[] = await this.entityManager
      .getRepository(CampaignEntity)
      .createQueryBuilder('campaign')
      .leftJoinAndMapMany(
        'campaign.campaignItems',
        CampaignItemEntity,
        'campaignItem',
        'campaign.id = campaignItem.campaignId',
      )
      .where('campaign.id IN(:...ids)', { ids: itemIds })
      .getMany();

    this.validateQuotationCampaigns(
      cloneDeep(orderItems),
      cloneDeep(campaigns),
    );

    const quotations = await Promise.all(
      campaigns.map((campaign) => {
        return this.productService.quotationProducts(
          campaign.campaignItems.map((item) => {
            return {
              quantity: item.quantity,
              type: ItemType.PRODUCT,
              itemId: item.productId,
            };
          }),
        );
      }),
    );

    const mapOrderItem = new Map<number, OrderItemDto>();
    orderItems.forEach((item) => mapOrderItem.set(item.itemId, item));

    campaigns.forEach((campaign, index) => {
      const quotation = quotations[index];
      const orderItem = mapOrderItem.get(campaign.id);
      result.items.push({
        itemId: orderItem.itemId,
        name: campaign.name,
        discount: campaign.discount,
        price: quotation.totalAmount,
        promotion: undefined,
        quantity: orderItem.quantity,
        type: orderItem.type,
        detail: quotation.items,
        totalAmount: BigNumber(quotation.totalAmount)
          .multipliedBy(orderItem.quantity)
          .minus(BigNumber(campaign.discount).multipliedBy(orderItem.quantity))
          .toFixed(3),
      });

      result.totalAmount = BigNumber(result.totalAmount)
        .plus(last(result.items)?.totalAmount || 0)
        .toFixed(3);
    });

    return result;
  }

  private validateQuotationCampaigns(
    orderItems: OrderItemDto[],
    campaigns: CampaignEntity[],
  ): void {
    // Set campaign to map
    const campaignsMap = new Map<number, CampaignEntity>();
    campaigns.forEach((campaign) => {
      campaignsMap.set(campaign.id, campaign);
    });

    orderItems.forEach((orderItem) => {
      const campaignItem = campaignsMap.get(orderItem.itemId);
      if (!campaignItem) {
        throw new AppException(CAMPAIGN_NOT_FOUND, {
          orderId: orderItem.itemId,
          message: 'Not found product by item id',
        });
      }

      if (campaignItem.limit - orderItem.quantity < campaignItem.used) {
        throw new AppException(CAMPAIGN_REMAIN_QUANTITY_NOT_ENOUGH, {
          campaignId: campaignItem.id,
          orderQuantity: orderItem.quantity,
          campaignRemainQuantity: campaignItem.limit - campaignItem.used,
        });
      }

      if (!campaignItem.active) {
        throw new AppException(PRODUCT_ITEM_NOT_ACTIVE, {
          orderId: orderItem.itemId,
        });
      }

      const dateNow = Date.now();
      if (
        dateNow < campaignItem.startDate.getTime() ||
        dateNow > campaignItem.endDate.getTime()
      ) {
        throw new AppException(CAMPAIGN_INVALID, {
          orderId: orderItem.itemId,
          startDateValid: campaignItem.startDate,
          endDateValid: campaignItem.endDate,
        });
      }
    });
  }

  private validateCampaignDisscount(
    products: ProductEntity[],
    discount: string,
    campaignItems: CampaignItemDto[],
  ): void {
    const mapItem = new Map<number, CampaignItemDto>();
    let totalAmount = '0';

    campaignItems.forEach((item) => mapItem.set(item.itemId, item));

    products.forEach((product) => {
      totalAmount = BigNumber(totalAmount)
        .plus(
          BigNumber(product.price).multipliedBy(
            mapItem.get(product.id).quantity,
          ),
        )
        .toString();
    });

    if (BigNumber(totalAmount).isLessThan(discount)) {
      throw new AppException(CAMPAIGN_DISCOUNT_INVALID);
    }
  }
}
