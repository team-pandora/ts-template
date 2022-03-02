import * as express from 'express';
import { StatusCodes } from 'http-status-codes';

export class ServerError extends Error {
    constructor(public code: number, public message: string, public originalError?: any, public meta?: any) {
        super();
    }

    public get responseJson(): any {
        return { ...this, originalError: undefined };
    }
}

export const errorMiddleware = (
    error: Error,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    let serverError: ServerError;

    if (error instanceof ServerError) {
        serverError = error;
    } else if (error.name === 'ValidationError') {
        serverError = new ServerError(StatusCodes.BAD_REQUEST, error.message, error, { type: 'validation' });
    } else {
        serverError = new ServerError(StatusCodes.INTERNAL_SERVER_ERROR, error.message, error, {
            type: 'internal',
        });
    }

    res.status(serverError.code).json(serverError.responseJson);

    res.locals.error = serverError;

    next();
};
