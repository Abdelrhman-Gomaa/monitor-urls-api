
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, MinLength, Matches, IsNumber, IsBoolean, IsUUID, IsOptional } from 'class-validator';
import { assertType, authenticationType } from '../check.type';

export class CreateCheckInput {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(6)
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    url: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    protocol: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    path: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    port: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    webhook: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    timeout: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    interval: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    threshold: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ type: authenticationType })
    @IsNotEmpty()
    authentication: authenticationType;

    @ApiProperty({ type: [String] })
    @IsString({ each: true })
    @IsNotEmpty()
    httpHeaders: string[];

    @ApiProperty({ type: assertType })
    @IsNotEmpty()
    assert: assertType;

    @ApiProperty({ type: [String] })
    @IsString({ each: true })
    @IsNotEmpty()
    tags: string[];

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    ignoreSSL: boolean;

}