import { IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength, minLength } from "class-validator";
import { GenderEnum } from '../user.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserInput {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    phone: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @IsNotEmpty()
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'Password too week' }
    ) //uppercase , lowercase , number or special character
    @ApiProperty()
    password: string;

    @IsEnum(GenderEnum)
    @ApiProperty({ enum: GenderEnum })
    gender: GenderEnum;

}
