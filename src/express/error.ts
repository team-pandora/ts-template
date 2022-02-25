import * as express from 'express';
import { StatusCodes } from 'http-status-codes';

export class ServerError extends Error {
    constructor(public code: number, public message: string, public meta?: object) {
        super();
    }
}

export const errorMiddleware = (
    error: Error,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    let formattedError: ServerError;

    switch (true) {
        case error instanceof ServerError:
            formattedError = error as ServerError;
            break;
        case error.name === 'ValidationError':
            formattedError = new ServerError(StatusCodes.BAD_REQUEST, error.message, { type: 'validation' });
            break;
        default:
            formattedError = new ServerError(StatusCodes.INTERNAL_SERVER_ERROR, error.message, { type: 'internal' });
            break;
    }

    res.status(formattedError.code).json(formattedError);

    res.locals.error = formattedError;

    next();
};
