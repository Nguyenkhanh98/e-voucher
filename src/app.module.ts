import { CustomConfigModule } from '@common/config/config.module';
import { AppDataSource } from '@common/config/datasource.config';
import { LoggerModule } from '@common/logger/logger.module';
import { ApiModule } from '@module/api.module';
import { CustomerApiModule } from '@module/customer-api.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

@Module({
  imports: [
    CustomConfigModule,
    ApiModule,
    CustomerApiModule,
    TypeOrmModule.forRootAsync({
      useFactory() {
        return AppDataSource.options;
      },
      async dataSourceFactory(options) {
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
