import { VoucherTypeEntity } from '@common/entities';
import { VoucherTypeListDTO } from '@module/pss/voucher-type/dtos/voucher-type.dto';
import { ApiProperty } from '@nestjs/swagger';
export class CreateVoucherTypeDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty({
    enum: VoucherTypeEntity._GroupType,
    default: VoucherTypeEntity._GroupType.Claim,
  })
  groupType: string;

  @ApiProperty()
  rules: any;

  @ApiProperty()
  voucherPssType: VoucherTypeListDTO;

  @ApiProperty()
  description: string;
}
