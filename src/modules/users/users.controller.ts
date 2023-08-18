import { ApiKey } from '@common/constants/api-key';
import { Permission } from '@common/decorators/permission.decorator';
import { Role } from '@common/decorators/role.decorator';
import { UsePaginate } from '@common/decorators/use-paginate.decorator';
import { UserEntity, UserRole } from '@common/entities/user.entity';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { GetUserOptions } from './dtos/get-user.option';
import { CreateUserDto } from './dtos/user.dto';
import { UserService } from './users.service';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Auth } from '@common/decorators/auth.decorator';
import { UpdateUser } from './dtos/update-user.dto';
import {
  ConfirmForgotPasswordDto,
  ForgotPasswordDto,
} from './dtos/forgot-password';

@ApiTags('Users')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  @UseInterceptors(ClassSerializerInterceptor)
  @Role([UserRole.ADMIN])
  @Permission(ApiKey.CREATE_USER_PERMISSION)
  async createUser(@Body() userData: CreateUserDto) {
    return await this.userService.createUser(userData);
  }

  @Get()
  @UsePaginate(GetUserOptions)
  @UseInterceptors(ClassSerializerInterceptor)
  @Role([UserRole.ADMIN])
  @Permission(ApiKey.GET_USERS_PERMISSION)
  async getUser(@Paginate() query: PaginateQuery) {
    return this.userService.getUser(query);
  }

  @Get('/info/:id')
  @ApiOperation({ summary: 'Get user info for admin' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Role([UserRole.ADMIN])
  @Permission(ApiKey.GET_INFO_USER_PERMISSION)
  async getInfo(@Param('id') userId: number) {
    return this.userService.getInfoUser(userId, false);
  }

  @Get('/info')
  @ApiOperation({ summary: 'Get user info for current user' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Auth()
  async getInfoCurrent(@CurrentUser() user: UserEntity) {
    return this.userService.getInfoUser(user.id, true);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    return this.userService.forgotPassword(data);
  }

  @Post('/forgot-password/confirm')
  async confirmForgotPassword(@Body() data: ConfirmForgotPasswordDto) {
    return this.userService.confirmForgotPassword(data);
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Update user for admin' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Role([UserRole.ADMIN])
  @Permission(ApiKey.UPDATE_USER_PERMISSION)
  async updateUser(
    @Param('id') userId: number,
    @Body() updateData: UpdateUser,
  ) {
    return this.userService.updateUser(userId, updateData);
  }

  @Put()
  @ApiOperation({ summary: 'Update current user' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Auth()
  async updateCurrentUser(
    @CurrentUser() user: UserEntity,
    @Body() updateData: UpdateUser,
  ) {
    return this.userService.updateUser(user.id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @Role([UserRole.ADMIN])
  @Permission(ApiKey.DELETE_USER_PERMISSION)
  async deleteUser(@Param('id') userId: number) {
    return this.userService.deleteUser(userId);
  }
}
