import * as dotenv from 'dotenv';

import { IDbConfig } from './interfaces/dbConfig.interface';

import { core } from '@nyp19vp-be/shared';
dotenv.config({
  path:
    process.env.NODE_ENV !== 'dev' ? process.env.ENV_FILE : core.ENV_FILE.DEV,
});

export const dbCfg: IDbConfig = {
  host: process.env.DB_USERS_HOST,
  port: process.env.DB_USERS_PORT,
  username: process.env.DB_USERS_USER,
  password: process.env.DB_USERS_PASSWORD,
  database: process.env.DB_USERS_DATABASE,
};

export const getMongoConnectionString = (dbCfg: IDbConfig) => {
  console.log(`process.env.NODE_ENV ${process.env.NODE_ENV}`);

  console.log(
    'connection string: ',
    `mongodb://${dbCfg.username}:${dbCfg.password}@${dbCfg.host}:${dbCfg.port}/${dbCfg.database}`,
  );

  return `mongodb://${dbCfg.username}:${dbCfg.password}@${dbCfg.host}:${dbCfg.port}/${dbCfg.database}`;
};
