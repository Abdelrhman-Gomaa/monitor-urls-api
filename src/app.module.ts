import { Module } from '@nestjs/common';
import { DatabaseModule } from './_common/database/database.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './_common/mail/mail.module';
import { NestBullModule } from './_common/bull/bull.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    DatabaseModule,
    UserModule,
    MailModule,
    NestBullModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
