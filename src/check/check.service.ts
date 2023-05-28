import { Injectable, Inject } from '@nestjs/common';
import { Repositories } from 'src/_common/database/database.model.repositories';
import { Check } from './models/check.model';
@Injectable()
export class UserService {
    constructor(
        @Inject(Repositories.ChecksRepository)
        private readonly checkRepo: typeof Check,
    ) { }


}