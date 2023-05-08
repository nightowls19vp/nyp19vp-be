import { Request } from 'express';
import {
  ACCESS_JWT_COOKIE_NAME,
  REFRESH_JWT_COOKIE_NAME,
} from '../constants/authentication';

const extractBearerTokenFromReqHeader = (req: Request) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ').length === 2 &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return undefined;
};

/**
 * Extract access token as `string` from req, else return `undefined`.
 * Access token can be passed in req.cookie or req.headers.authorization (Bearer token)
 * Cookie first then request header
 */
export const getAccessToken = (req: Request): string => {
  // extract from cookie
  let accessToken: string = req?.cookies?.[ACCESS_JWT_COOKIE_NAME];

  // if token not provided in cookie
  if (!accessToken) {
    accessToken = extractBearerTokenFromReqHeader(req);
  }

  return accessToken;
};

/**
 * Extract refresh token as `string` from req, else return `undefined`.
 * Refresh token can be passed in req.cookie or req.headers.authorization (Bearer token)
 * Cookie first then request header
 */
export const getRefreshToken = (req: Request): string => {
  // extract from cookie
  let refreshToken: string = req?.cookies?.[REFRESH_JWT_COOKIE_NAME];

  // if token not provided in cookie
  if (!refreshToken) {
    refreshToken = extractBearerTokenFromReqHeader(req);
  }

  return refreshToken;
};
