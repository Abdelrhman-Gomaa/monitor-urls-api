import * as jwt from 'jsonwebtoken';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { CreateUserInput } from '../input/create.user.input';
import { LoginUserInput } from '../input/login.user.input';
import { User } from '../models/user.model';
import { Repositories } from 'src/_common/database/database.model.repositories';
import { TokenPayload } from 'src/auth/auth-token-payload.interface';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { ErrorCodeEnum } from 'src/_common/exceptions/error-code.enum';
import { ChangePasswordInput } from '../input/change.password.input';
import { UserByEmailBasedOnUseCaseOrErrorInput } from '../user.interface';
import { LangEnum, UserVerificationCodeUseCaseEnum } from '../user.enum';
import { generate } from 'voucher-code-generator';
import * as slug from 'speakingurl';
import { UserVerificationCodeService } from './user-verification-code.service';
import { VerifyUserByEmailInput } from '../input/verify-user-by-email.input';

@Injectable()
export class UserService {
    constructor(
        @Inject(Repositories.UsersRepository)
        private readonly userRepo: typeof User,
        private readonly userVerificationCodeService: UserVerificationCodeService,
    ) { }

    async findAll() {
        return await this.userRepo.findAll({ include: { all: true } });
    }

    async me(userId: string) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new BaseHttpException(ErrorCodeEnum.USER_DOES_NOT_EXIST);
        return user;
    }

    async register(input: CreateUserInput) {
        await this.deleteDuplicatedUsersAtUnVerifiedEmail(input.email);
        const existUser = await this.userRepo.findOne({
            where: {
                [Op.or]: [{ userName: input.userName }, { verifiedEmail: input.email }]
            }
        });
        if (existUser) throw new BaseHttpException(ErrorCodeEnum.USER_ALREADY_EXIST);

        const salt = await bcrypt.genSalt();
        const password = input.password;
        const hashPassword = await bcrypt.hash(password, salt);

        try {
            const { email } = input;
            const user = await this.userRepo.create({
                firstName: input.firstName,
                lastName: input.lastName,
                fullName: `${input.firstName} ${input.lastName}`,
                userName: input.userName,
                slug: this.slugify(`${input.firstName} - ${input.lastName || ''}`),
                unVerifiedEmail: input.email,
                password: hashPassword,
                phone: input.phone,
                gender: input.gender
            });
            await this.userVerificationCodeService.sendEmailVerificationCode(
                user.id,
                {
                    favLang: LangEnum.EN,
                    email,
                    useCase: UserVerificationCodeUseCaseEnum.EMAIL_VERIFICATION
                },
                'App Account Verification'
            );
            return user;
        } catch (error) {
            console.log(error.message);
        }

    }

    async signIn(input: LoginUserInput) {
        const user = await this.validationUserPassword(input);
        if (!user) {
            throw new UnauthorizedException('Invalid Credentials');
        }
        const payload: TokenPayload = { userId: user.id };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET);
        return { accessToken };
    }

    async changePassword(currentUser: string, input: ChangePasswordInput) {
        const user = await this.userRepo.findOne({ where: { id: currentUser } });
        if (!user) throw new BaseHttpException(ErrorCodeEnum.INVALID_USER);
        await this.matchPassword(input.oldPassword, user.password);
        if (input.newPassword !== input.confirmPassword) throw new BaseHttpException(ErrorCodeEnum.NEW_PASSWORD_NOT_CONFIRMED);
        if (input.newPassword === input.oldPassword) throw new BaseHttpException(ErrorCodeEnum.OLD_PASSWORD_AND_NEW_ARE_MATCHED);
        const hashPassword = await bcrypt.hash(input.newPassword, 12);
        return await this.userRepo.update({ password: hashPassword }, { where: { id: user.id } });
    }

    async deleteDuplicatedUsersAtUnVerifiedEmail(duplicatedEmail: string) {
        await this.userRepo.destroy({
            where: {
                [Op.or]: [
                    {
                        unVerifiedEmail: duplicatedEmail.toLowerCase(),
                        isCompletedRegister: false
                    },
                    {
                        verifiedEmail: duplicatedEmail.toLowerCase(),
                        isCompletedRegister: false
                    }
                ]
            }
        });
    }

    public async verifyUserByEmail(input: VerifyUserByEmailInput): Promise<{ accessToken: string; }> {
        const user = await this.userVerificationCodeService.userByEmailBasedOnUseCaseOrError({
            email: input.email,
            useCase: UserVerificationCodeUseCaseEnum.EMAIL_VERIFICATION
        });
        await this.userVerificationCodeService.validVerificationCodeOrError({
            user,
            useCase: UserVerificationCodeUseCaseEnum.EMAIL_VERIFICATION,
            verificationCode: input.verificationCode
        });
        await this.errorIfOtherUserHasSameVerifiedEmail(input.email, user.id);
        const updateUser = await this.userVerificationCodeService.deleteVerificationCodeAndUpdateUserModel(
            { user, useCase: UserVerificationCodeUseCaseEnum.EMAIL_VERIFICATION },
            { verifiedEmail: input.email, unVerifiedEmail: null }
        );
        const payload: TokenPayload = { userId: user.id };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET);
        return { accessToken };
    }

    private async errorIfOtherUserHasSameVerifiedEmail(email: string, currentUserId: string) {
        const otherUser = await this.userRepo.findOne({
            where: {
                verifiedEmail: email,
                id: { [Op.ne]: currentUserId }
            }
        });
        if (otherUser) throw new BaseHttpException(ErrorCodeEnum.EMAIL_ALREADY_EXISTS);
    }

    async userByEmailBasedOnUseCaseOrError(input: UserByEmailBasedOnUseCaseOrErrorInput) {
        return input.useCase === UserVerificationCodeUseCaseEnum.EMAIL_VERIFICATION
            ? await this.userVerificationCodeService.userByNotVerifiedEmailOrError(input.email)
            : await this.userVerificationCodeService.userByVerifiedEmailOrError(input.email);
    }

    private async validationUserPassword(input: LoginUserInput) {
        const user = await this.userRepo.findOne({ where: { verifiedEmail: input.email } });
        if (user) {
            await this.matchPassword(input.password, user.password);
            return user;
        } else {
            return null;
        }
    }

    private async matchPassword(password: string, hash: string) {
        const isMatched = hash && (await bcrypt.compare(password, hash));
        if (!isMatched) throw new BaseHttpException(ErrorCodeEnum.INCORRECT_PASSWORD);
    }

    private slugify(value: string): string {
        if (value.charAt(value.length - 1) === '-') value = value.slice(0, value.length - 1);
        return `${slug(value, { titleCase: true })}-${generate({
            charset: '123456789abcdefghgklmnorstuvwxyz',
            length: 4
        })[0]
            }`.toLowerCase();
    }
}
