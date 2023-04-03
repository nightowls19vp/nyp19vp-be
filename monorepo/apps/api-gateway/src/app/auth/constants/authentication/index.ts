export const ACCESS_JWT_COOKIE_NAME = 'access_token';
export const REFRESH_JWT_COOKIE_NAME = 'refresh_token';

export const LOCAL_STRATEGY_NAME = 'local';

export const ACCESS_JWT_STRATEGY_NAME = 'access_jwt';
export const ACCESS_JWT_DEFAULT_SECRET = 'access_secret';
export const ACCESS_JWT_DEFAULT_TTL = '10m';

export const REFRESH_JWT_STRATEGY_NAME = 'refresh_jwt';
export const REFRESH_JWT_DEFAULT_SECRET = 'refresh_secret';
export const REFRESH_JWT_DEFAULT_TTL = '10d';

export const JWT_TOKEN_ERRORS = {
  TOKEN_EXPIRED_ERROR: 'TokenExpiredError',
  NOT_BEFORE_ERROR: 'NotBeforeError',
  JWT_ERROR: 'JsonWebTokenError',
};

export const GOOGLE_STRATEGY_NAME = 'google';