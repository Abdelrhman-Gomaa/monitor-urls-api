import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';


export class FindCheckInput {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID('4')
    checkId: string;
}