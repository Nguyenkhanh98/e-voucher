import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CampaignService } from './campaign.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { UsePaginate } from '@common/decorators/use-paginate.decorator';
import { CampaignDto, UpdateCampaignDto } from './dtos/campaign.dto';
import { GetCampaignOptions } from './dtos/get-campaign-option';
import { Role } from '@common/decorators/role.decorator';
import { UserRole } from '@common/entities';
import { Permission } from '@common/decorators/permission.decorator';
import { ApiKey } from '@common/constants/api-key';

@ApiTags('Campaign')
@Controller('/campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get()
  @UsePaginate(GetCampaignOptions)
  async getCampaigns(@Paginate() query: PaginateQuery) {
    return this.campaignService.getCampaigns(query);
  }

  @Get('info/:id')
  async getInfoCampaign(@Param('id') campaignId: string) {
    return this.campaignService.getInfoCampaign(campaignId);
  }

  @Post()
  @Role([UserRole.ADMIN])
  @Permission(ApiKey.CREATE_CAMPAIGN_PERMISSION)
  async createCampaign(@Body() createData: CampaignDto) {
    return this.campaignService.createCampaign(createData);
  }

  @Put('/:id')
  @Role([UserRole.ADMIN])
  @Permission(ApiKey.UPDATE_CAMPAIGN_PERMISSION)
  async updateCampaign(
    @Param('id') campaignId: number,
    @Body() updateData: UpdateCampaignDto,
  ) {
    return this.campaignService.updateCampaign(campaignId, updateData);
  }

  @Delete('/id')
  @Role([UserRole.ADMIN])
  @Permission(ApiKey.DELETE_CAMPAIGN_PERMISSION)
  async deleteCampaign(@Param('id') campaignId: number) {
    return this.campaignService.updateStatusCampaign(campaignId, false);
  }

  @Patch('/active/:id')
  @Role([UserRole.ADMIN])
  @Permission(ApiKey.ACTIVE_CAMPAIGN_PERMISSION)
  async activeCampaign(@Param('id') campaignId: number) {
    return this.campaignService.updateStatusCampaign(campaignId, true);
  }
}
