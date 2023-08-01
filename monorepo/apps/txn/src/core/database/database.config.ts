import * as dotenv from 'dotenv';

import { IDbConfig } from './interfaces/dbConfig.interface';
import { ENV_FILE } from '@nyp19vp-be/shared';

dotenv.config({
  path: process.env.NODE_ENV !== 'dev' ? process.env.ENV_FILE : ENV_FILE.DEV,
});

export const dbCfg: IDbConfig = {
  host: process.env.DB_TXN_HOST,
  port: process.env.DB_TXN_PORT,
  username: process.env.DB_TXN_USER,
  password: process.env.DB_TXN_PASSWORD,
  database: process.env.DB_TXN_DATABASE,
};

export const getMongoConnectionString = (dbCfg: IDbConfig) => {
  console.log(`process.env.NODE_ENV ${process.env.NODE_ENV}`);

  if (process.env.NODE_ENV === 'dev') {
    const connectionStr = `mongodb://${dbCfg.username}:${dbCfg.password}@${dbCfg.host}:${dbCfg.port}/${dbCfg.database}?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0`;
    console.log('connection string', connectionStr);
    return connectionStr;
  } else {
    const connectionStr = `mongodb://${dbCfg.username}:${dbCfg.password}@${dbCfg.host}:${dbCfg.port}/${dbCfg.database}?serverSelectionTimeoutMS=2000`;
    console.log('connection string', connectionStr);

    return connectionStr;
  }
};
