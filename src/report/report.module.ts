import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { ReportProcessor } from './report.processor';
import { DatabaseModule } from 'src/_common/database/database.module';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';

@Module({
    imports: [DatabaseModule, ScheduleModule.forRoot(), HttpModule],
    controllers: [ReportController],
    providers: [ReportService, ReportProcessor],
    exports: [ReportService]
})
export class ReportModule { }