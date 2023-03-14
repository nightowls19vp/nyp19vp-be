import { Logger } from '@nestjs/common';
import * as winston from 'winston';

const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    // winston.format.errors({ stack: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSSZZ' }),
    winston.format.prettyPrint(),
    winston.format.json(),
  ),
  defaultMeta: { service: 'backend-service' },
  transports: [new winston.transports.Console()],
});

if (process.env.NODE_ENV !== 'production') {
  winstonLogger.level = 'debug';
}

export class FDLogger extends Logger {
  error(error, stack?: string) {
    if (stack) {
      winstonLogger.error(error, { stack });
    } else {
      winstonLogger.error(error);
    }
  }
  info(message: string) {
    winstonLogger.info(message);
  }
  log(message: string) {
    winstonLogger.info(message);
  }
  debug(message: string) {
    winstonLogger.debug(message);
  }
}
