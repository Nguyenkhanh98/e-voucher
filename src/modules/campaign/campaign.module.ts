import { ProductEntity } from '@common/entities';
import { CampaignItemEntity } from '@common/entities/campaign-item.entity';
import { CampaignEntity } from '@common/entities/campaign.entity';
import { LoggerModule } from '@common/logger/logger.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@shared/shared.module';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { ProductModule } from '@module/products/products.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      CampaignEntity,
      CampaignItemEntity,
      ProductEntity,
    ]),
    LoggerModule,
    SharedModule,
    ProductModule,
  ],
  controllers: [CampaignController],
  providers: [CampaignService],
  exports: [CampaignService],
})
export class CampaignModule {}
