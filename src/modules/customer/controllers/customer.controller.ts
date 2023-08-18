import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Customer } from '@common/decorators/customer.decorator';
import { CustomerEntity } from '@common/entities';
import { AuthService } from '@module/auth/auth.service';
import { LoginResponse } from '@module/auth/dtos/auth-response.dto';
import { LoginAuthDto } from '@module/auth/dtos/auth.dto';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomerService } from '../services/customer.service';
import { ActiveCustomerDto, RegisterCustomerDto } from '../dtos/customer.dto';
import { ForgotPasswordCustomerDto } from '../dtos/forgot-password.dto';
import { UpdateCustomer } from '../dtos/update-customer.dto';

@ApiTags('Customers')
@Controller('/customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private authService: AuthService,
  ) {}

  @Get('/info')
  @ApiOperation({ summary: 'Get custommer info for current customer' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Customer()
  async getInfoCurrent(@CurrentUser() customer: CustomerEntity) {
    return this.customerService.getInfoCustomer(customer.id);
  }

  @Put()
  @ApiOperation({ summary: 'Update current customer' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Customer()
  async updateCurrentCustomer(
    @CurrentUser() customer: CustomerEntity,
    @Body() updateData: UpdateCustomer,
  ) {
    return this.customerService.updateCustomer(customer.id, updateData);
  }

  @Post('login')
  @ApiOkResponse({ type: LoginResponse })
  @UseInterceptors(ClassSerializerInterceptor)
  async customerLogin(@Body() loginData: LoginAuthDto) {
    return await this.authService.customerLogin(loginData);
  }

  @Post('active')
  @ApiOkResponse({ type: LoginResponse })
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async activeCustomer(@Body() activeData: ActiveCustomerDto) {
    return this.customerService.activeCustomer(activeData, false);
  }

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  async registerCustomer(@Body() registerData: RegisterCustomerDto) {
    return this.customerService.registerCustomer(registerData);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordCustomerDto) {
    return this.customerService.forgotPassword(data);
  }

  @Post('/forgot-password/confirm')
  async confirmForgotPassword(@Body() data: ActiveCustomerDto) {
    return this.customerService.activeCustomer(data, true);
  }
}
