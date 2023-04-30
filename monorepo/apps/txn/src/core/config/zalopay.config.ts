import * as dotenv from 'dotenv';
import { CONST } from '@nyp19vp-be/shared';
dotenv.config({
  path:
    process.env.NODE_ENV !== 'dev' ? process.env.ENV_FILE : CONST.ENV_FILE.DEV,
});

export const zpconfig = {
  app_id: process.env.ZALOPAY_APP_ID,
  key1: process.env.ZALOPAY_KEY1,
  create_order_endpoint: process.env.ZALOPAY_CREATE_ENDPOINT,
  get_status_endpoint: process.env.ZALOPAY_STATUS_ENDPOINT,
  callback_url: process.env.ZALOPAY_CALLBACK,
};
