import { Injectable, Inject } from '@nestjs/common';
import { Repositories } from 'src/_common/database/database.model.repositories';
import { Check } from './models/check.model';
import { Report } from 'src/report/models/report.model';
import { CreateCheckInput } from './input/create-check.input';
import { BaseHttpException } from 'src/_common/exceptions/base-http-exception';
import { ErrorCodeEnum } from 'src/_common/exceptions/error-code.enum';
import { UpdateCheckInput } from './input/update-Check.input';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PingStatus } from 'src/report/report.enum';
import { History } from 'src/report/models/history.model';

@Injectable()
export class CheckService {
    constructor(
        @Inject(Repositories.ChecksRepository)
        private readonly checkRepo: typeof Check,
        @InjectQueue('monitoring') private readonly monitorQueue: Queue
    ) { }

    async createCheck(input: CreateCheckInput, userId: string) {
        const existingCheck = await this.checkRepo.findOne({ where: { url: input.url } });
        if (existingCheck) throw new BaseHttpException(ErrorCodeEnum.CHECK_ALREADY_EXIST);
        const check = await this.checkRepo.create({ ...input, userId });
        try {
            await this.monitorQueue.add('monitoring',
                {
                    id: check.id,
                    protocol: check.protocol,
                    url: check.url
                },
                {
                    repeat: {
                        limit: 3,
                        every: check.interval
                    },
                    jobId: check.id.toString(),
                });
        } catch (error) { console.log('>>>>>>>>>>> :', error); }
        return check;
    }

    async getCheck(checkId: string, userId: string) {
        const existingCheck = await this.checkRepo.findOne({ where: { id: checkId, userId } });
        if (!existingCheck) throw new BaseHttpException(ErrorCodeEnum.CHECK_DOSE_NOT_EXIST);
        return existingCheck;
    }

    async updateCheck(checkId: string, input: UpdateCheckInput, userId: string) {
        const existingCheck = await this.getCheck(checkId, userId);
        //Delete the old check from the ping scheduler
        // await PingScheduler.deletePing(dto.checkId);
        const updatedCheck = await this.checkRepo.update({ ...input }, { where: { id: checkId, userId } });
        //Then add the new one
        // await PingScheduler.addPing(newcheck);
        return await this.checkRepo.findOne({ where: { id: checkId, userId } });
    }

    async deleteCheck(checkId: string, userId: string) {
        await this.getCheck(checkId, userId);
        const deletedCheck = await this.checkRepo.destroy({ where: { id: checkId, userId } });
        // await PingScheduler.deletePing(dto.checkId)
        return deletedCheck !== 0 ? true : false;
    }

}