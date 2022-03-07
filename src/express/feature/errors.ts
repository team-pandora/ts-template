import { StatusCodes } from 'http-status-codes';
import { ServerError } from '../error';

export const unknownFeatureError = (error: any) =>
    new ServerError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal feature error', error, { type: 'internal' });

export const mongoDuplicateKeyError = (error: any) =>
    new ServerError(
        StatusCodes.BAD_REQUEST,
        `Duplicate key error: Feature with ${JSON.stringify(error.keyValue)} already exists`,
        error,
        {
            type: 'mongo',
        },
    );
