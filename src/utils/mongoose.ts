import * as mongoose from 'mongoose';
import { mongoDuplicateKeyError } from './express/errors';

function setDefaultSettings(schema: mongoose.Schema) {
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

const setErrorHandler = (schema: mongoose.Schema) => {
    schema.post(['update', 'findOneAndUpdate'], errorHandler);
};

const makeTransaction = async <Type>(
    transaction: (session: mongoose.ClientSession) => Promise<Type>,
): Promise<Type> => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const result = await transaction(session);
        await session.commitTransaction();
        return result;
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
};

export { setErrorHandler, setDefaultSettings, makeTransaction };
