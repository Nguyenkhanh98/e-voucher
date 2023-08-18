import {
  ApiOkResponse,
  ApiProperty,
  ApiResponseProperty,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  isObject,
  IsString,
} from 'class-validator';

class FareClass {
  href: string;
  key: string;
  code: string;
  description: string;
}
class ApplicableFareClass {
  @ApiProperty()
  key: string;

  @ApiProperty()
  fareClass: FareClass;
}

class Airport {
  href: string;
  code: string;
  name: string;
}
class Journey {
  @ApiProperty()
  airport: Airport;
}

class CityPair {
  href: string;
  identifier: string;
  departure: Journey;
  arrival: Journey;
}
class ApplicableCityPair {
  @ApiProperty()
  key: string;

  @ApiProperty()
  cityPair: CityPair;
}

class Company {
  href: string;
  key: string;
  identifier: string;
  name: string;
}
class ApplicableCompany {
  key: string;
  company: Company;
}

class RedemptionCondition {
  @ApiProperty()
  paysFullBalance: boolean;

  @ApiProperty()
  applicableToFareOnly: boolean;

  @ApiProperty()
  pinRequired: boolean;

  @ApiProperty()
  oneTimeUse: boolean;

  @ApiProperty()
  applicableFareClasses: ApplicableFareClass[];

  @ApiProperty()
  applicableCityPairs: ApplicableCityPair[];

  @ApiProperty()
  applicableCompanies: ApplicableCompany[];
  redemptionCondition: RedemptionCondition[];
}

export class VoucherTypeListDTO {
  @ApiProperty()
  href: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;
}
export class VoucherTypeDTO {
  @ApiProperty()
  href: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: any;

  @ApiProperty()
  value: number;

  @ApiProperty()
  validFrom: string;

  @ApiProperty()
  currency: any;

  @ApiProperty()
  validTo: string;

  @ApiProperty()
  transferrable: boolean;

  @ApiProperty()
  redemptionConditions: RedemptionCondition[];
}

export const VoucherTypeReponseSchema = () => {
  return ApiOkResponse({
    description: 'Success',
    schema: {
      type: 'object',
      properties: {
        href: { type: 'string' },
        key: { type: 'string' },
        name: { type: 'string' },
        status: { type: 'string' },
        value: { type: 'number' },
        validFrom: { type: 'string' },
        currency: { type: 'string' },
        validTo: { type: 'string' },
        transferrable: { type: 'string' },
        redemptionConditions: { type: 'object' },
      },
    },
  });
};
