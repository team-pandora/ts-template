import { StatusCodes } from 'http-status-codes';
import { ServerError } from '../../express/error';

export const mongoDuplicateKeyError = (error: { keyValue?: object }) =>
    new ServerError(
        StatusCodes.BAD_REQUEST,
        `Duplicate key error: Object with ${JSON.stringify(error.keyValue)} already exists.`,
        error,
    );
