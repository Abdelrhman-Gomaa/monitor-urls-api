import { ApiProperty } from '@nestjs/swagger';
import { DeviceEnum } from './user.enum';

export class LocationType {
  @ApiProperty()
  type: string;

  @ApiProperty({isArray: true})
  coordinates: number[];
}

export class LastLoginDetailsType {
  @ApiProperty()
  lastLoginAt?: number | Date;

  @ApiProperty()
  readableLastLoginAt?:  number | Date;

  @ApiProperty({enum: DeviceEnum})
  lastLoginDevice?: DeviceEnum;
}