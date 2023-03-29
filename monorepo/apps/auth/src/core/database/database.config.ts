import * as dotenv from 'dotenv';

import { core } from '@nyp19vp-be/shared';
import { IDbConfig } from './interfaces/dbConfig.interface';

dotenv.config({
  path:
    process.env.NODE_ENV !== 'dev' ? process.env.ENV_FILE : core.ENV_FILE.DEV,
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
