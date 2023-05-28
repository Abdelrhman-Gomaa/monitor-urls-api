import * as jwt from 'jsonwebtoken';
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/models/user.model';
import { TokenPayload } from './auth-token-payload.interface';
import { Repositories } from 'src/_common/database/database.model.repositories';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { ErrorCodeEnum } from 'src/_common/exceptions/error-code.enum';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(Repositories.UsersRepository)
        private readonly userRepo: typeof User,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.header('Authorization').split(' ')[1];
        if (!token) throw new BaseHttpException(ErrorCodeEnum.UNAUTHORIZED);
        const { userId } = <TokenPayload>jwt.verify(token, process.env.JWT_SECRET);
        if (!userId) throw new BaseHttpException(ErrorCodeEnum.INVALID_TOKEN);
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new BaseHttpException(ErrorCodeEnum.INVALID_USER);
        return true;
    }
}