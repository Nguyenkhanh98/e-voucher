import { ApiQuery } from '@nestjs/swagger';

export const GetUserOptions = [
  ApiQuery({
    name: 'filter.id',
    required: false,
    description: 'Condition allow: EQ',
  }),
  ApiQuery({
    name: 'filter.firstName',
    required: false,
    description: 'Condition allow: EQ, ILIKE, NULL',
  }),
  ApiQuery({
    name: 'filter.lastName',
    required: false,
    description: 'Condition allow: EQ, ILIKE, NULL',
  }),
  ApiQuery({
    name: 'filter.email',
    required: false,
    description: 'Condition allow: EQ, ILIKE, NULL',
  }),
  ApiQuery({
    name: 'filter.status',
    required: false,
    description: 'Condition allow: EQ, NOT, NULL',
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
