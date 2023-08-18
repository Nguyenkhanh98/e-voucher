import { UserRole } from '@common/entities/user.entity';
import { ApiResponseProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  firstName: string;

  @ApiResponseProperty()
  lastName: string;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty({ enum: UserRole })
  role?: UserRole;
}

export class CustomerResponse {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  firstName: string;

  @ApiResponseProperty()
  lastName: string;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  phone: string;

  @ApiResponseProperty({ enum: UserRole })
  role?: UserRole;
}

export class LoginResponse {
  @ApiResponseProperty()
  accessToken: string;

  @ApiResponseProperty({ type: UserResponse })
  user: UserResponse | CustomerResponse;
}
