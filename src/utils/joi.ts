import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';
import { ServerError } from '../express/error';
import wrapMiddleware from './express';
import { objectAssignSpecific as objectAssignByKeys } from './object';

export const JoiObjectId = Joi.string().hex().length(24);

export const JoiMongoObjectId = JoiObjectId.custom((value) => new mongoose.Types.ObjectId(value));

const defaultValidationOptions: Joi.ValidationOptions = {
    abortEarly: false,
    allowUnknown: false,
    convert: true,
};

const ValidateRequest = <T>(schema: Joi.ObjectSchema<T>, options: Joi.ValidationOptions = defaultValidationOptions) => {
    return wrapMiddleware(async (req: Request) => {
        const { error, value } = schema.unknown().validate(req, options) as Joi.ValidationResult<Request>;
        if (error) throw new ServerError(StatusCodes.BAD_REQUEST, error.message);
        if (options.convert) objectAssignByKeys(req, value, ['body', 'query', 'params']);
    });
};

export default ValidateRequest;
