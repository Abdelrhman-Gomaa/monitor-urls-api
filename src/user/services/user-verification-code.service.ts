import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import {
  DeleteVerificationCodeAndUpdateUserModelInput,
  UserByEmailBasedOnUseCaseOrErrorInput,
  ValidVerificationCodeOrErrorInput,
  VerificationCodeAndExpirationDate
} from '../user.interface';
import { LangEnum, UserVerificationCodeUseCaseEnum } from '../user.enum';
import { User } from '../models/user.model';
import { ErrorCodeEnum } from '../../_common/exceptions/error-code.enum';
import { UserVerificationCode } from '../models/user-verification-code.model';
import { BaseHttpException } from '../../_common/exceptions/base-http-exception';
import { Repositories } from 'src/_common/database/database.model.repositories';
import { getEmailMsg } from 'src/_common/utils/mail-msg';
import { SendEmailVerificationCodeInput } from '../input/send-email-verification.input';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Op } from 'sequelize';

@Injectable()
export class UserVerificationCodeService {
  constructor(
    @Inject(Repositories.UserVerificationCodesRepository)
    private readonly userVerificationCodeRepo: typeof UserVerificationCode,
    @Inject(Repositories.UsersRepository)
    private readonly userRepo: typeof User,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
    @InjectQueue('mail-otp') private readonly mailQueue: Queue
  ) { }

  public async sendEmailVerificationCode(
    userId: string,
    input: SendEmailVerificationCodeInput,
    subject: string
  ) {
    const codeAndExpiry = await this.generateVerificationCodeAndRemoveOldOne(userId, input.useCase);
    const msg = this.getVerificationMsg(
      codeAndExpiry.verificationCode,
      input.favLang,
      input.useCase,
      input.firstName
    );
    this.mailQueue.add('mail-otp', {
      to: input.email,
      subject,
      html: msg
    }, {
      delay: 1000
    });
    return true;
  }

  public async userByEmailBasedOnUseCaseOrError(
    input: UserByEmailBasedOnUseCaseOrErrorInput
  ): Promise<User> {
    switch (input.useCase) {
      case UserVerificationCodeUseCaseEnum.PASSWORD_RESET:
        return await this.userByVerifiedEmailOrError(input.email);

      case UserVerificationCodeUseCaseEnum.EMAIL_VERIFICATION:
        return await this.userByNotVerifiedEmailOrError(input.email);
    }
  }

  public async validVerificationCodeOrError(input: ValidVerificationCodeOrErrorInput) {
    const verificationCode = await this.userVerificationCodeRepo.findOne({
      where: {
        userId: input.user.id,
        code: input.verificationCode
      }
    });
    if (!verificationCode) throw new BaseHttpException(ErrorCodeEnum.VERIFICATION_CODE_NOT_EXIST);
    if (verificationCode.expiryDate < new Date())
      throw new BaseHttpException(ErrorCodeEnum.EXPIRED_VERIFICATION_CODE);
    return true;
  }

  public async deleteVerificationCodeAndUpdateUserModel(
    input: DeleteVerificationCodeAndUpdateUserModelInput,
    fieldsWillUpdated: object
  ): Promise<User> {
    return await this.sequelize.transaction(async transaction => {
      await this.userVerificationCodeRepo.destroy(
        {
          where: { userId: input.user.id, useCase: input.useCase },
          transaction
        }
      );
      await this.userRepo.update(
        {
          ...fieldsWillUpdated,
        }, {
        where: { id: input.user.id },
        transaction
      }
      );
      return await this.userRepo.findOne({ where: { id: input.user.id }, transaction });
    });
  }

  private generateVerificationCodeAndExpiryDate(): VerificationCodeAndExpirationDate {
    return {
      verificationCode:
        process.env.NODE_ENV === 'production'
          ? Math.floor(100000 + Math.random() * 900000).toString()
          : '1234',
      expiryDateAfterOneHour: new Date(Date.now() + 3600000)
    };
  }

  private async generateVerificationCodeAndRemoveOldOne(
    userId: string,
    useCase: UserVerificationCodeUseCaseEnum
  ): Promise<VerificationCodeAndExpirationDate> {
    const codeAndExpiry = this.generateVerificationCodeAndExpiryDate();
    await this.sequelize.transaction(async transaction => {
      await this.userVerificationCodeRepo.destroy({ where: { userId, useCase }, transaction });
      await this.userVerificationCodeRepo.create(
        {
          code: codeAndExpiry.verificationCode,
          expiryDate: codeAndExpiry.expiryDateAfterOneHour,
          userId,
          useCase
        }, {
        transaction
      });
      return true;
    });
    return codeAndExpiry;
  }

  private getVerificationMsg(
    verificationCode: string | number,
    favLang: LangEnum = LangEnum.AR,
    useCase: UserVerificationCodeUseCaseEnum,
    firstName?: string
  ): string {
    return getEmailMsg(verificationCode, favLang, useCase, firstName);
  }

  async userByNotVerifiedEmailOrError(email: string) {
    const user = await this.userRepo.findOne({ where: { unVerifiedEmail: email } });
    if (!user) throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
    return user;
  }

  async userByVerifiedEmailOrError(email: string) {
    const user = await this.userRepo.findOne({ where: { verifiedEmail: email } });
    if (!user) throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
    return user;
  }
}
