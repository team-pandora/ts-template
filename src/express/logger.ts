import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../utils/logger';
import { prettyDuration } from '../utils/time';
import { ServerError } from './error';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { statusCode } = res;
    const requestTime = performance.now() - res.locals.startTime;
    const meta = {
        express: true,
        method: req.method,
        originalUrl: req.originalUrl,
        path: req.path,
        status: statusCode,
        requestTime,
        duration: prettyDuration(requestTime),
        user: req.user?.id ? req.user : null,
        client: req.client?.clientId ? req.client : null,
        remoteAddress: req.headers['remote-address'] || null,
        userAgent: req.headers['user-agent'] || null,
        host: req.headers['host'] || null,
        protocol: req.headers['scheme'] || null,
        requestSize: req.socket.bytesRead,
        responseSize: parseInt(res.getHeader('content-length') as string) || null,
        requestedAt: res.locals.startTime,
        query: req.query,
        params: req.params,
        accessToken: req.cookies['access_token'] || req.query.access_token,
        errorMessage: res.locals.error?.message,
    };

    const error: ServerError = (res.locals.error as ServerError) ? res.locals.error : null;

    switch (true) {
        case statusCode >= StatusCodes.INTERNAL_SERVER_ERROR:
            logger.error(
                `Internal error: ${error.message}, \nStack:\n${error.stack}\nOriginal Error:\n${error.originalError}`,
                meta,
            );
            break;

        case statusCode >= StatusCodes.BAD_REQUEST:
            logger.warn(`Request error: ${error.message}`, meta);
            break;

        default:
            logger.info(`Successful request`, meta);
            break;
    }

    next();
};

export const setStartTime = (_req: Request, res: Response, next: NextFunction) => {
    res.locals.startTime = performance.now();
    next();
};
