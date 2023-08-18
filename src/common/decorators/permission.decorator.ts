import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AUTH_KEY } from './auth.decorator';
import { ApiKey } from '@common/constants/api-key';

export const PERMISSIONS_KEY = 'permissions';

export const Permission = (permissions: ApiKey) => {
  return applyDecorators(
    SetMetadata(AUTH_KEY, true),
    SetMetadata(PERMISSIONS_KEY, permissions),
    ApiBearerAuth(),
  );
};
