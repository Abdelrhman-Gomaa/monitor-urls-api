import { History } from './models/history.model';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Injectable, Inject } from '@nestjs/common';
import { Job, Queue } from 'bull';
import * as os from 'os';
import { Check } from 'src/check/models/check.model';
import { HttpService } from '@nestjs/axios';
import { PingStatus } from './report.enum';
import { Repositories } from 'src/_common/database/database.model.repositories';

@Processor('monitoring')
@Injectable()
export class ReportProcessor {
    constructor(
        @InjectQueue('monitoring') private readonly monitorQueue: Queue,
        private readonly httpService: HttpService,
        @Inject(Repositories.HistoriesRepository)
        private readonly historyRepo: typeof History
    ) { }

    @Process({
        name: 'monitoring',
        // concurrency: os.cpus().length
    })
    async monitorUrls(job: Job) {
        const { id, protocol, url, port }: Check = job.data;
        let siteUrl = `${protocol}://${url}`;
        if (port) siteUrl = `${protocol}://${url}:${port}`;
        try {
            const startTime = Date.now();
            await this.httpService.get(siteUrl).toPromise();
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            await this.historyRepo.create({
                status: PingStatus.UP, responseTime: responseTime, timestamp: Date.now(), checkId: id
            });
        } catch (error) {
            await this.historyRepo.create({
                status: PingStatus.DOWN, responseTime: 0, timestamp: Date.now(), checkId: id
            });
        }
    }

    // @OnQueueActive()
    // async onActive(job: Job) {
    //     // console.log(
    //     //     `Processing job ${job.id} of type ${job.name} `,
    //     // );
    // }
}
