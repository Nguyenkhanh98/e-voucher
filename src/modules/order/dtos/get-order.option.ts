import { ApiQuery } from '@nestjs/swagger';

export const GetOrderOptions = [
  ApiQuery({
    name: 'filter.id',
    required: false,
    description: 'Condition allow: EQ',
  }),
  ApiQuery({
    name: 'filter.orderId',
    required: false,
    description: 'Condition allow: EQ, ILIKE',
  }),
  ApiQuery({
    name: 'filter.customerId',
    required: false,
    description: 'Condition allow: EQ',
  }),
  ApiQuery({
    name: 'filter.status',
    required: false,
    description: 'Condition allow: EQ, NOT',
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
