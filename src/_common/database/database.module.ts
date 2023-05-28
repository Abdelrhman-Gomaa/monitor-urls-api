import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { ModelsProvider } from './models.providers';
@Module({
    providers: [...databaseProviders, ...ModelsProvider],
    exports: [...databaseProviders, ...ModelsProvider]
})
export class DatabaseModule {}
