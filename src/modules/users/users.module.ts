import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { UserEntity } from '@common/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@common/logger/logger.module';
import { RolePermissionEntity } from '@common/entities/role-permission.entity';
import { SharedModule } from '@shared/shared.module';
import { AuthModule } from '@module/auth/auth.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RolePermissionEntity]),
    LoggerModule,
    SharedModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
