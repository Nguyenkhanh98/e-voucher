import { DataSource, DataSourceOptions } from 'typeorm';

import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER_NAME || 'khanhnguyen',
  password: process.env.DATABASE_PASSWORD || '12345678',
  database: process.env.DATABASE || 'evoucher',
  schema: process.env.DATABASE_SCHEMA || 'public',
  synchronize: false,
  migrations: [__dirname + './../../migrations/*{.ts,.js}'],
  entities: [__dirname + '../../../**/**/*entity{.ts,.js}'],
  logging: true,
  migrationsRun: false,
  migrationsTableName: 'history',
  timezone: 'utc',
} as DataSourceOptions);
