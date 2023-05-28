import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/_common/database/database.module';
import { CheckService } from './check.service';
import { CheckController } from './check.controller';

@Module({
    imports: [DatabaseModule],
    controllers: [CheckController],
    providers: [CheckService],
    exports: [CheckService]
})
export class CheckModule { }