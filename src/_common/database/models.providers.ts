import { Repositories } from "./database.model.repositories";
import { User } from "src/user/models/user.model";
import { UserVerificationCode } from "src/user/models/user-verification-code.model";
import { Check } from 'src/check/models/check.model';
import { Report } from 'src/report/models/report.model';
import { History } from 'src/report/models/history.model';

export const ModelsProvider = [
    {
        provide: Repositories.UsersRepository,
        useValue: User,
    },
    {
        provide: Repositories.UserVerificationCodesRepository,
        useValue: UserVerificationCode,
    },
    {
        provide: Repositories.ChecksRepository,
        useValue: Check,
    },
    {
        provide: Repositories.ReportsRepository,
        useValue: Report,
    },
    {
        provide: Repositories.HistoriesRepository,
        useValue: History,
    },
];
