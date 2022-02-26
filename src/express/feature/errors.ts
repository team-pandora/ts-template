import { ServerError } from '../error';

export const unknownFeatureError = (error: any) =>
    new ServerError(500, 'Internal feature error', error, { type: 'internal' });

export const mongoDuplicateKeyError = (error: any) =>
    new ServerError(400, `Duplicate key error: Feature with ${JSON.stringify(error.keyValue)} already exists`, error, {
        type: 'mongo',
    });
