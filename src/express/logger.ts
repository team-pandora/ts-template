import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../utils/logger';
import { getPreciseTime, prettyDuration } from '../utils/time';
import { ServerError } from './error';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { statusCode } = res;

    const meta = {
        express: true,
        method: req.method,
        url: req.originalUrl,
        status: statusCode,
        duration: prettyDuration(getPreciseTime() - res.locals.startTime),
    };

    const error: ServerError = (res.locals.error as ServerError) ? res.locals.error : null;

    switch (true) {
        case statusCode >= StatusCodes.INTERNAL_SERVER_ERROR:
            logger.log(
                'error',
                `Internal error: ${error.message}, \nStack:\n${error.stack}\nOriginal Error:\n${error.originalError}`,
                meta,
            );
            break;

        case statusCode >= StatusCodes.BAD_REQUEST:
            logger.log('warn', `Request error: ${error.message}`, meta);
            break;

        default:
            logger.log('info', `Successful request`, meta);
            break;
    }

    next();
};

export const setStartTime = (_req: Request, res: Response, next: NextFunction) => {
    res.locals.startTime = getPreciseTime();
    next();
};
