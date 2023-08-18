import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@common/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from '@common/logger/logger.module';
import { UserModule } from '@module/users/users.module';
import { CustomerEntity } from '@common/entities';
import { RolePermissionEntity } from '@common/entities/role-permission.entity';
@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      UserEntity,
      CustomerEntity,
      RolePermissionEntity,
    ]),
    LoggerModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
