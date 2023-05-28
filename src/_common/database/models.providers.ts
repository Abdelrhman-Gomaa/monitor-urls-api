import { Repositories } from "./database.model.repositories";
import { User } from "src/user/models/user.model";
import { UserVerificationCode } from "src/user/models/user-verification-code.model";

export const ModelsProvider = [
    {
        provide: Repositories.UsersRepository,
        useValue: User,
    },
    {
        provide: Repositories.UserVerificationCodesRepository,
        useValue: UserVerificationCode,
    },
];
