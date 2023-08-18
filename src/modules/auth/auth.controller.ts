import { Role } from '@common/decorators/role.decorator';
import { UserRole } from '@common/entities';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginResponse } from './dtos/auth-response.dto';
import { LoginAuthDto } from './dtos/auth.dto';
import { PermissionDto } from './dtos/permission.dto';
import { RegisterUser } from './dtos/register.dto';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: LoginResponse })
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@Body() loginData: LoginAuthDto) {
    return this.authService.login(loginData);
  }

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() registerData: RegisterUser) {
    return this.authService.register(registerData);
  }

  @Get('permission')
  @Role([UserRole.SUPER_ADMIN])
  async getPermission() {
    return this.authService.getPermission();
  }

  @Post('permission')
  @Role([UserRole.SUPER_ADMIN])
  async addPermisison(@Body() permissionData: PermissionDto) {
    return this.authService.addPermission(permissionData);
  }

  @Delete('permission')
  @Role([UserRole.SUPER_ADMIN])
  async removePermisison(@Body() permissionData: PermissionDto) {
    return this.authService.removePermission(permissionData);
  }
}
