import { ApiKey } from '@common/constants/api-key';
import { Permission } from '@common/decorators/permission.decorator';
import { Role } from '@common/decorators/role.decorator';
import { UsePaginate } from '@common/decorators/use-paginate.decorator';
import { UserRole } from '@common/entities';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { CustomerService } from '../services/customer.service';
import { GetCustomerOptions } from '../dtos/get-customer.dto';
import { UpdateCustomer } from '../dtos/update-customer.dto';

@ApiTags('Customers admin')
@Controller('/admin/customer')
export class CustomerAdminController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @UsePaginate(GetCustomerOptions)
  @UseInterceptors(ClassSerializerInterceptor)
  @Role([UserRole.ADMIN])
  @Permission(ApiKey.GET_CUSTOMERS_PERMISSION)
  async getCustomers(@Paginate() query: PaginateQuery) {
    return this.customerService.getCustomers(query);
  }

  @Get('/info/:id')
  @ApiOperation({ summary: 'Get customer info for admin' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Role([UserRole.ADMIN])
  @Permission(ApiKey.GET_INFO_CUSTOMER_PERMISSION)
  async getInfo(@Param('id') customerId: number) {
    return this.customerService.getInfoCustomer(customerId);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update customer for admin' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Role([UserRole.ADMIN])
  @Permission(ApiKey.UPDATE_CUSTOMER_PERMISSION)
  async updateCustomer(
    @Param('id') customerId: number,
    @Body() updateData: UpdateCustomer,
  ) {
    return this.customerService.updateCustomer(customerId, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete customer' })
  @Role([UserRole.ADMIN])
  @Permission(ApiKey.DELETE_CUSTOMER_PERMISSION)
  async deleteCustomer(@Param('id') customerId: number) {
    return this.customerService.deleteCustomer(customerId);
  }
}
