import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { Report } from './models/report.model';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Report')
@Controller()
export class ReportController {
    constructor(
        private readonly reportService: ReportService,
    ) { }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Create Report" })
    @Post('/createReport/:checkId')
    async createReport(@Param('checkId') checkId: string,): Promise<Report> {
        return await this.reportService.createReport(checkId);
    }
}