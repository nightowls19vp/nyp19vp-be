import * as dotenv from 'dotenv';

import { IDbConfig } from './interfaces/dbConfig.interface';
import { ENV_FILE } from '@nyp19vp-be/shared';

dotenv.config({
  path: process.env.NODE_ENV !== 'dev' ? process.env.ENV_FILE : ENV_FILE.DEV,
});

console.log('process.env.ENV_FILE', process.env.ENV_FILE);

console.log({
  host: process.env.DB_AUTH_HOST,
  port: process.env.DB_AUTH_PORT,
  username: 'root',
  password: 'root',
  database: process.env.DB_AUTH_DATABASE,
});

export const dbCfg: IDbConfig = {
  host: process.env.DB_AUTH_HOST,
  port: process.env.DB_AUTH_PORT,
  username: 'root',
  password: 'root',
  database: process.env.DB_AUTH_DATABASE,
};
