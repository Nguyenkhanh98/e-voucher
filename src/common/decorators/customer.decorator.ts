import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export const CUSTOMER_KEY = 'customer';
export const Customer = () => {
  return applyDecorators(
    SetMetadata(CUSTOMER_KEY, true),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
};
