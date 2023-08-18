import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';

import { AUTH_KEY } from './auth.decorator';
import { UserRole } from '@common/entities/user.entity';

export type Role = UserRole[];

export const ROLE_KEY = 'role';

export const Role = (role: UserRole[]) => {
  return applyDecorators(
    SetMetadata(AUTH_KEY, true),
    SetMetadata(ROLE_KEY, role),
    ApiBearerAuth(),
    ApiForbiddenResponse,
  );
};
