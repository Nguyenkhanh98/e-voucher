import { AppLogger } from '@common/logger/logger.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ActiveCustomerDto, RegisterCustomerDto } from '../dtos/customer.dto';
import { CustomerEntity, CustomerStatus } from '@common/entities';
import { AppException } from '@common/exceptions/app-exception';
import {
  CUSTOMER_EXIST,
  CUSTOMER_HAS_ACTIVED,
  CUSTOMER_NOT_FOUND,
} from '@common/exceptions/error';
import { AuthService } from '@module/auth/auth.service';
import { LoginResponse } from '@module/auth/dtos/auth-response.dto';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '@shared/services/mail.service';
import {
  FilterOperator,
  FilterSuffix,
  PaginateQuery,
  paginate,
} from 'nestjs-paginate';
import { UpdateCustomer } from '../dtos/update-customer.dto';
import { ForgotPasswordCustomerDto } from '../dtos/forgot-password.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    private readonly logger: AppLogger,
    private readonly authService: AuthService,
    private readonly emailService: MailService,
  ) {
    this.logger.setContext(CustomerService.name);
  }

  async getCustomers(query: PaginateQuery) {
    const result = await paginate(
      query,
      this.entityManager.getRepository(CustomerEntity),
      {
        sortableColumns: [
          'createdAt',
          'status',
          'phone',
          'email',
          'firstName',
          'lastName',
        ],
        nullSort: 'last',
        defaultSortBy: [['createdAt', 'DESC']],
        filterableColumns: {
          id: [FilterOperator.EQ],
          lastName: [
            FilterOperator.ILIKE,
            FilterOperator.EQ,
            FilterOperator.NULL,
          ],
          firstName: [
            FilterOperator.ILIKE,
            FilterOperator.EQ,
            FilterOperator.NULL,
          ],
          phone: [FilterOperator.ILIKE, FilterOperator.EQ, FilterOperator.NULL],
          email: [FilterOperator.ILIKE, FilterOperator.EQ, FilterOperator.NULL],
          status: [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.NULL],
          createdAt: [FilterOperator.BTW],
          updatedAt: [FilterOperator.BTW],
        },
      },
    );

    return result;
  }

  async getInfoCustomer(customerId: number) {
    const customer = await this.entityManager
      .getRepository(CustomerEntity)
      .createQueryBuilder('customer')
      .where('customer.id = :id', { id: customerId })
      .getOne();

    if (!customer) {
      throw new BadRequestException(CUSTOMER_NOT_FOUND);
    }
    return customer;
  }

  async updateCustomer(customerId: number, updateData: UpdateCustomer) {
    const findCustomer = await this.entityManager
      .getRepository(CustomerEntity)
      .findOne({
        where: { id: customerId },
      });

    if (!findCustomer) {
      throw new BadRequestException(CUSTOMER_NOT_FOUND);
    }

    const updateRecord = this.entityManager
      .getRepository(CustomerEntity)
      .create({
        ...findCustomer,
        ...updateData,
      });
    return await this.entityManager
      .getRepository(CustomerEntity)
      .save(updateRecord);
  }

  async registerCustomer(registerData: RegisterCustomerDto) {
    const findCustomer = await this.entityManager
      .getRepository(CustomerEntity)
      .findOne({
        where: { email: registerData.email },
      });

    if (findCustomer) throw new AppException(CUSTOMER_EXIST);

    const newCustomer = this.entityManager
      .getRepository(CustomerEntity)
      .create({
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        phone: registerData.phone,
        status: CustomerStatus.NEW,
        activeKey: uuidv4(),
      });
    await newCustomer.save();

    this.emailService.sendEmailActiveCustomer(newCustomer);

    return newCustomer;
  }

  async activeCustomer(
    activeData: ActiveCustomerDto,
    forgotPassword: boolean,
  ): Promise<LoginResponse> {
    const findCustomer = await this.entityManager
      .getRepository(CustomerEntity)
      .findOne({
        where: {
          activeKey: activeData.activeKey,
        },
      });

    if (!findCustomer) {
      throw new AppException(CUSTOMER_NOT_FOUND);
    }

    if (forgotPassword && findCustomer.status !== CustomerStatus.NEW) {
      throw new AppException(CUSTOMER_HAS_ACTIVED);
    }

    const updateCustomer = this.entityManager
      .getRepository(CustomerEntity)
      .create({
        ...findCustomer,
        status: CustomerStatus.ACTIVE,
        password: activeData.password,
        activeKey: undefined,
      });
    await this.entityManager.getRepository(CustomerEntity).save(updateCustomer);

    const session = this.authService.customerLogin({
      email: findCustomer.email,
      password: activeData.password,
    });
    return session;
  }

  async deleteCustomer(customerId: number) {
    const findUser = await this.entityManager
      .getRepository(CustomerEntity)
      .findOne({
        where: { id: customerId },
      });

    if (!findUser) {
      throw new BadRequestException(CUSTOMER_NOT_FOUND);
    }

    await this.entityManager.getRepository(CustomerEntity).delete(customerId);

    return 'SUCCESS';
  }

  async forgotPassword(data: ForgotPasswordCustomerDto) {
    const findCustomer = await this.entityManager
      .getRepository(CustomerEntity)
      .findOne({
        where: {
          email: data.email,
        },
      });

    if (!findCustomer) {
      throw new AppException(CUSTOMER_NOT_FOUND);
    }

    findCustomer.activeKey = uuidv4();
    await findCustomer.save();

    this.emailService.sendEmailForgotPassword(
      findCustomer.email,
      findCustomer.activeKey,
      false,
    );

    return 'SUCCESS';
  }
}
