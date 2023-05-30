import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { ErrorCodeEnum } from 'src/_common/exceptions/error-code.enum';
import { UserVerificationCodeUseCaseEnum, LangEnum } from 'src/user/user.enum';

export class SendEmailVerificationCodeInput {
  favLang: LangEnum;

  firstName?: string;

  @IsEmail({}, { message: ErrorCodeEnum[ErrorCodeEnum.INVALID_EMAIL] })
  @ApiProperty()
  email: string;

  @ApiProperty({enum: UserVerificationCodeUseCaseEnum})
  useCase: UserVerificationCodeUseCaseEnum;
}
