import { Post, Controller, Get, Param, UseGuards, Body, ValidationPipe, Patch, Delete } from '@nestjs/common';
import { CheckService } from './check.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Check } from './models/check.model';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { CreateCheckInput } from './input/create-check.input';
import { UpdateCheckInput } from './input/update-Check.input';
import { AuthGuard } from 'src/auth/auth.guard';
import { Report } from 'src/report/models/report.model';

@ApiTags('Check')
@Controller()
export class CheckController {
    constructor(
        private readonly checkService: CheckService,
    ) { }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Find Specific Check" })
    @Get('/:checkId')
    async getCheck(@Param('checkId') checkId: string, @CurrentUser() currentUser: string): Promise<Check> {
        return await this.checkService.getCheck(checkId, currentUser);
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Create Check" })
    @Post('/createCheck')
    async createCheck(@Body(ValidationPipe) input: CreateCheckInput, @CurrentUser() currentUser: string): Promise<Check> {
        return await this.checkService.createCheck(input, currentUser);
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Update Check" })
    @Patch('/updateCheck/:checkId')
    async updateCheck(@Param('checkId') checkId: string, @Body(ValidationPipe) input: UpdateCheckInput, @CurrentUser() currentUser: string): Promise<Check> {
        return await this.checkService.updateCheck(checkId, input, currentUser);
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Delete Check" })
    @Delete('/deleteCheck/:checkId')
    async deleteCheck(@Param('checkId') checkId: string, @CurrentUser() currentUser: string): Promise<Boolean> {
        return await this.checkService.deleteCheck(checkId, currentUser);
    }

}