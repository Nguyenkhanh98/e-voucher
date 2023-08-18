import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { VoucherTypeEntity } from '@common/entities/vouchery-type.entity';
import { plainToClass } from 'class-transformer';
import { CreateVoucherTypeDTO } from './dtos/create-voucher.dto';
import { mapPlainToEntity } from '@helpers/entity.helper';

@Injectable()
export class VoucherTypeService {
  private voucherTypeRepository: Repository<VoucherTypeEntity>;

  constructor(private readonly entityManager: EntityManager) {
    this.voucherTypeRepository =
      this.entityManager.getRepository(VoucherTypeEntity);
  }

  public async createVoucherType(
    body: CreateVoucherTypeDTO,
  ): Promise<VoucherTypeEntity> {
    const partialEntity = plainToClass(VoucherTypeEntity, body);
    return await this.voucherTypeRepository.create(partialEntity).save();
  }

  public async updateVoucherType(id: any, body: CreateVoucherTypeDTO) {
    const partialEntity = mapPlainToEntity(VoucherTypeEntity, body);
    const result = await this.voucherTypeRepository.update(id, partialEntity);
    return !!result;
  }

  public async getVoucherType(query): Promise<VoucherTypeEntity[]> {
    return await this.voucherTypeRepository.find({ where: query });
  }

  public async getVoucherTypeById(id): Promise<VoucherTypeEntity> {
    return await this.voucherTypeRepository.findOne({ where: { id } });
  }
}
