import * as mongoose from 'mongoose';
import { mongoDuplicateKeyError } from './express/errors';

export class ObjectId extends mongoose.Types.ObjectId {}

export const setDefaultSettings = (schema: mongoose.Schema) => {
    schema.pre(/.*/, function setSettings() {
        if (typeof this.lean === 'function') this.lean();
    });
};

const errorHandler = (
    error: { code?: number; keyValue?: object } & mongoose.CallbackError,
    _: unknown,
    next: mongoose.CallbackWithoutResultAndOptionalError,
) => {
    if (error?.code === 11000) {
        next(mongoDuplicateKeyError(error));
    } else {
        next(error);
    }
};

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
