import * as dotenv from 'dotenv';
import { ENV_FILE } from 'libs/shared/src/lib/core/constants';

dotenv.config({
  path: process.env.ENV_FILE ? process.env.ENV_FILE : ENV_FILE.DEV,
});

console.log({
  accessJwtSecret: process.env.ACCESS_JWT_SECRET || 'access',
  accessJwtTtl: process.env.ACCESS_JWT_TLL || '10m',
  refreshJwtSecret: process.env.REFRESH_JWT_SECRET || 'refresh',
  refreshJwtTtl: process.env.REFRESH_JWT_TTL || '10d',
});

export const strategyConfig = {
  accessJwtSecret: process.env.ACCESS_JWT_SECRET || 'access',
  accessJwtTtl: process.env.ACCESS_JWT_TLL || '10m',
  refreshJwtSecret: process.env.REFRESH_JWT_SECRET || 'refresh',
  refreshJwtTtl: process.env.REFRESH_JWT_TTL || '10d',
};
