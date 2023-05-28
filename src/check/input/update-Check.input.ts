
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength, Matches, IsNumber, IsBoolean, IsUUID, IsOptional } from 'class-validator';
import { assertType, authenticationType } from '../check.type';

export class UpdateCheckInput {
    @ApiProperty()
    @IsString()
    @IsOptional()
    @MaxLength(30)
    @MinLength(6)
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    url: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    protocol: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    path: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    port: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    webhook: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    timeout: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    interval: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    threshold: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    email: string;

    @ApiProperty({ type: authenticationType })
    @IsOptional()
    authentication: authenticationType;

    @ApiProperty({ type: [String] })
    @IsString({ each: true })
    @IsOptional()
    httpHeaders: string[];

    @ApiProperty({ type: assertType })
    @IsOptional()
    assert: assertType;

    @ApiProperty({ type: [String] })
    @IsString({ each: true })
    @IsOptional()
    tags: string[];

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    ignoreSSL: boolean;

}