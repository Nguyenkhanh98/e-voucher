import { ApiQuery } from '@nestjs/swagger';

export const GetCampaignOptions = [
  ApiQuery({
    name: 'filter.id',
    required: false,
    description: 'Condition allow: EQ',
  }),
  ApiQuery({
    name: 'filter.name',
    required: false,
    description: 'Condition allow: EQ, ILIKE, NULL',
  }),
  ApiQuery({
    name: 'filter.nameEn',
    required: false,
    description: 'Condition allow: EQ, ILIKE, NULL',
  }),
  ApiQuery({
    name: 'filter.description',
    required: false,
    description: 'Condition allow: ILIKE, NULL',
  }),
  ApiQuery({
    name: 'filter.startDate',
    required: false,
    description: 'Condition allow: GTE, NULL',
    example: '$gte:2023-05-31T11:32:16.901Z',
  }),
  ApiQuery({
    name: 'filter.endDate',
    required: false,
    description: 'Condition allow: LTE, NULL',
    example: '$lte:2023-05-31T11:32:16.901Z',
  }),
  ApiQuery({
    name: 'filter.discount',
    required: false,
    description: 'Condition allow: EQ, ILIKE',
  }),
  ApiQuery({
    name: 'filter.active',
    required: false,
    description: 'Condition allow: EQ',
  }),
  ApiQuery({
    name: 'filter.createdAt',
    required: false,
    description: 'Condition allow: BTW',
    example: '$btw:2023-05-31T11:32:16.901Z,2023-05-31T11:32:16.901Z',
  }),
  ApiQuery({
    name: 'filter.updatedAt',
    required: false,
    description: 'Condition allow: BTW',
    example: '$btw:2023-05-31T11:32:16.901Z,2023-05-31T11:32:16.901Z',
  }),
];
