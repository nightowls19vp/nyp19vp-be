import * as dotenv from 'dotenv';

import { CONST } from '@nyp19vp-be/shared';
import { IDbConfig } from './interfaces/dbConfig.interface';

dotenv.config({
  path:
    process.env.NODE_ENV !== 'dev' ? process.env.ENV_FILE : CONST.ENV_FILE.DEV,
});

console.log({
  host: process.env.DB_AUTH_HOST,
  port: process.env.DB_AUTH_PORT,
  username: process.env.DB_AUTH_USER,
  password: process.env.DB_AUTH_PASSWORD,
  database: process.env.DB_AUTH_DATABASE,
});

export const dbCfg: IDbConfig = {
  host: process.env.DB_AUTH_HOST,
  port: process.env.DB_AUTH_PORT,
  username: process.env.DB_AUTH_USER,
  password: process.env.DB_AUTH_PASSWORD,
  database: process.env.DB_AUTH_DATABASE,
};
