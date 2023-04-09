import * as dotenv from 'dotenv';

import { IDbConfig } from './interfaces/dbConfig.interface';

import { ENV_FILE } from '@nyp19vp-be/shared';
dotenv.config({
  path: process.env.NODE_ENV !== 'dev' ? process.env.ENV_FILE : ENV_FILE.DEV,
});

export const dbCfg: IDbConfig = {
  host: process.env.DB_PKG_MGMT_HOST,
  port: process.env.DB_PKG_MGMT_PORT,
  username: process.env.DB_PKG_MGMT_USER,
  password: process.env.DB_PKG_MGMT_PASSWORD,
  database: process.env.DB_PKG_MGMT_DATABASE,
};

export const getMongoConnectionString = (dbCfg: IDbConfig) => {
  console.log(`process.env.NODE_ENV ${process.env.NODE_ENV}`);

  console.log(
    'connection string: ',
    `mongodb://${dbCfg.username}:${dbCfg.password}@${dbCfg.host}:${dbCfg.port}/${dbCfg.database}`,
  );

  return `mongodb://${dbCfg.username}:${dbCfg.password}@${dbCfg.host}:${dbCfg.port}/${dbCfg.database}`;
};
