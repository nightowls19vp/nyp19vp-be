import * as dotenv from 'dotenv';
import { CONST } from '@nyp19vp-be/shared';
dotenv.config({
  path:
    process.env.NODE_ENV !== 'dev' ? process.env.ENV_FILE : CONST.ENV_FILE.DEV,
});

export const zpconfig = {
  app_id: process.env.ZALOPAY_APP_ID,
  key1: process.env.ZALOPAY_KEY1,
  endpoint: process.env.ZALOPAY_ENDPOINT,
};
