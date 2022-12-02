import * as express from 'express';
import { StatusCodes } from 'http-status-codes';

export class ServerError extends Error {
    constructor(public code: number, public message: string, public originalError?: object, public meta?: object) {
        super();
    }

    public get responseJson() {
        return { ...this, originalError: undefined };
    }
}

const formatError = (error: Error) => {
    if (error instanceof ServerError) return error;
    if (error instanceof SyntaxError) return new ServerError(StatusCodes.BAD_REQUEST, error.message, error);
    return new ServerError(StatusCodes.INTERNAL_SERVER_ERROR, error.message, error);
};

export const errorMiddleware = (
    error: Error,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    const serverError = formatError(error);

    res.status(serverError.code).json(serverError.responseJson);

    res.locals.error = serverError;

    next();
};
