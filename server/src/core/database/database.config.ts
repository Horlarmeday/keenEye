import { IDatabaseConfig } from './database.interface';

export const databaseConfig: IDatabaseConfig = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    dialect: 'mysql',
    autoLoadModels: true,
    synchronize: true,
  },
  test: {
    username: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_NAME,
    host: process.env.TEST_DB_HOST,
    port: +process.env.TEST_DB_PORT,
    dialect: 'mysql',
    autoLoadModels: true,
    synchronize: true,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    dialect: 'mysql',
    autoLoadModels: true,
    synchronize: true,
  },
};
