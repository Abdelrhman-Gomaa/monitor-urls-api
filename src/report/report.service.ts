import { Inject, Injectable } from '@nestjs/common';
import { Repositories } from 'src/_common/database/database.model.repositories';
import { Report } from './models/report.model';
import { Check } from 'src/check/models/check.model';
import { History } from './models/history.model';
import { PingStatus } from './report.enum';

@Injectable()
export class ReportService {
    constructor(
        @Inject(Repositories.ChecksRepository)
        private readonly checkRepo: typeof Check,
        @Inject(Repositories.ReportsRepository)
        private readonly reportRepo: typeof Report,
        @Inject(Repositories.HistoriesRepository)
        private readonly historyRepo: typeof History,
    ) { }


    async createReport(checkId) {
        let check = await this.checkRepo.findOne({ where: { id: checkId } });
        let pingList = await this.historyRepo.findAll({ where: { checkId } });
        console.log('>>>>>>>>>>> :', pingList);
        let history = [];
        history.push(pingList);

        const lastPingStatus = pingList[pingList.length - 1].status;
        const outages = pingList.filter((ping) => ping.status === PingStatus.DOWN).length;
        const ups = pingList.filter((ping) => ping.status === PingStatus.UP).length;
        const uptime = (check.interval ?? 0) * ups;
        const downtime = (check.interval ?? 0) * outages;
        const availability = parseFloat(Number((uptime / (uptime + downtime)) * 100).toFixed(2));
        const averageResponseTime = parseFloat(
            Number(
                pingList.map((entry) => entry.responseTime).reduce((prev, curr): number => prev + curr, 0) /
                pingList.length
            ).toFixed(2)
        );

        return await this.reportRepo.create({
            status: lastPingStatus,
            ups,
            availability,
            outages,
            downtime,
            uptime,
            averageResponseTime,
            history: pingList,
            timestamp: Date.now(),
            checkId: checkId,
        });
    }
}