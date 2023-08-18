import { Module } from '@nestjs/common';
import { ProductController } from './products.controller';
import { ProductService } from './products.service';
import { ProductEntity, VoucherTypeEntity } from '@common/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@common/logger/logger.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, VoucherTypeEntity]),
    LoggerModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
