import * as mongoose from 'mongoose';
import { mongoDuplicateKeyError } from './express/errors';

export function setDefaultSettings(schema: mongoose.Schema) {
    // eslint-disable-next-line func-names
    schema.pre('*', function () {
        this.lean();
    });
}

function errorHandler(error: any, _res: any, next: any) {
    if (error.code === 11000) {
        next(mongoDuplicateKeyError(error));
    } else {
        next();
    }
}

export const setErrorHandler = (schema: mongoose.Schema) => {
    schema.post(['update', 'updateMany', 'updateOne', 'findOneAndUpdate'], errorHandler);
    schema.post(['save'], errorHandler);
};

export const makeTransaction = async <Type>(
    transaction: (session: mongoose.ClientSession) => Promise<Type>,
): Promise<Type> => {
    const session = await mongoose.startSession();
    try {
        let result: Type;
        await session.withTransaction(async () => {
            result = await transaction(session);
        });
        return result!;
    } finally {
        session.endSession();
    }
};
