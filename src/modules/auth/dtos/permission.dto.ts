import { ApiKey } from '@common/constants/api-key';
import { UserRole } from '@common/entities';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty } from 'class-validator';

export class PermissionDto {
  @ApiProperty({ default: UserRole.ADMIN })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ isArray: true, default: [ApiKey.CREATE_USER_PERMISSION] })
  @IsArray()
  @IsEnum(ApiKey, { each: true })
  @ArrayMinSize(1)
  permissions: ApiKey[];
}
