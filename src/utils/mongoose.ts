import { mongoDuplicateKeyError } from './express/errors';

export function errorHandler(error: any, _res: any, next: any) {
    if (error.code === 11000) {
        next(mongoDuplicateKeyError(error));
    } else {
        next();
    }
}

export default { errorHandler };
