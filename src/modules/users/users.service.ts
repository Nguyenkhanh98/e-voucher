import { RolePermissionEntity } from '@common/entities/role-permission.entity';
import { UserEntity, UserRole } from '@common/entities/user.entity';
import { AppException } from '@common/exceptions/app-exception';
import {
  CAN_NOT_CREATE_SUPER_ADMIN,
  USER_EXIST,
  USER_NOT_FOUND,
} from '@common/exceptions/error';
import { AppLogger } from '@common/logger/logger.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FilterOperator,
  FilterSuffix,
  PaginateQuery,
  paginate,
} from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/user.dto';
import { UpdateUser } from './dtos/update-user.dto';
import {
  ConfirmForgotPasswordDto,
  ForgotPasswordDto,
} from './dtos/forgot-password';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '@shared/services/mail.service';
import { AuthService } from '@module/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly logger: AppLogger,
    private readonly emailService: MailService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {
    this.logger.setContext(UserService.name);
  }

  async getUser(query: PaginateQuery) {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndMapMany(
        'user.rolePermission',
        RolePermissionEntity,
        'rolePermission',
        'user.role = rolePermission.role',
      )
      .select(['user', 'rolePermission.permission', 'rolePermission.role']);
    const result = await paginate(query, queryBuilder, {
      sortableColumns: [
        'createdAt',
        'status',
        'email',
        'firstName',
        'lastName',
        'updatedAt',
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
        email: [FilterOperator.ILIKE, FilterOperator.EQ, FilterOperator.NULL],
        status: [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.NULL],
        createdAt: [FilterOperator.BTW],
        updatedAt: [FilterOperator.BTW],
      },
    });

    return result;
  }

  async getInfoUser(userId: number, current: boolean) {
    const builder = this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId });

    if (!current) {
      builder
        .leftJoinAndMapMany(
          'user.rolePermission',
          RolePermissionEntity,
          'rolePermission',
          'user.role = rolePermission.role',
        )
        .select(['user', 'rolePermission.permission', 'rolePermission.role']);
    }

    const user = await builder.getOne();

    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND);
    }
    return user;
  }

  async updateUser(userId: number, updateData: UpdateUser) {
    const findUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!findUser) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    const updateRecord = this.userRepository.create({
      ...findUser,
      ...updateData,
    });
    return await this.userRepository.save(updateRecord);
  }

  async deleteUser(userId: number) {
    const findUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!findUser) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    await this.userRepository.delete(userId);

    return 'SUCCESS';
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const findUser = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (!findUser) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    findUser.activeKey = uuidv4();
    await findUser.save();

    this.emailService.sendEmailForgotPassword(
      findUser.email,
      findUser.activeKey,
      true,
    );

    return 'SUCCESS';
  }

  async confirmForgotPassword(data: ConfirmForgotPasswordDto) {
    const findUser = await this.userRepository.findOne({
      where: { activeKey: data.activeKey },
    });

    if (!findUser) {
      throw new BadRequestException(USER_NOT_FOUND);
    }

    await this.userRepository
      .create({ ...findUser, password: data.password, activeKey: undefined })
      .save();

    return await this.authService.login({
      email: findUser.email,
      password: data.password,
    });
  }

  async createUser(userData: CreateUserDto) {
    if (userData.role === UserRole.SUPER_ADMIN) {
      throw new AppException(CAN_NOT_CREATE_SUPER_ADMIN);
    }

    const findUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });
    if (findUser) throw new AppException(USER_EXIST);

    const saveUser: UserEntity = this.userRepository.create({
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
    });

    return saveUser.save();
  }
}
