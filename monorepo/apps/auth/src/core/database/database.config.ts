import * as dotenv from 'dotenv';

import { IDbConfig } from './interfaces/dbConfig.interface';

import { CONST } from '@nyp19vp-be/shared';
dotenv.config({
  path:
    process.env.NODE_ENV !== 'dev' ? process.env.ENV_FILE : CONST.ENV_FILE.DEV,
});

export const dbCfg: IDbConfig = {
  host: process.env.DB_AUTH_HOST,
  port: process.env.DB_AUTH_PORT,
  username: process.env.DB_AUTH_USER,
  password: process.env.DB_AUTH_PASSWORD,
  database: process.env.DB_AUTH_DATABASE,
};

export const getMongoConnectionString = (dbCfg: IDbConfig) => {
  console.log(`process.env.NODE_ENV ${process.env.NODE_ENV}`);

  console.log(
    'connection string: ',
    `mongodb://${dbCfg.username}:${dbCfg.password}@${dbCfg.host}:${dbCfg.port}/${dbCfg.database}`
  );

  return `mongodb://${dbCfg.username}:${dbCfg.password}@${dbCfg.host}:${dbCfg.port}/${dbCfg.database}`;
};
