import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserVerificationCodeService } from './services/user-verification-code.service';
import { DatabaseModule } from 'src/_common/database/database.module';
import { UserController } from './user.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserVerificationCodeService,
  ],
  exports: [
    UserService,
    UserVerificationCodeService
  ]
})
export class UserModule { }
