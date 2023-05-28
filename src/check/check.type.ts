import { ApiProperty } from '@nestjs/swagger';

export class authenticationType {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

export class assertType {
  @ApiProperty()
  type: string;

  @ApiProperty()
  required: boolean;
}