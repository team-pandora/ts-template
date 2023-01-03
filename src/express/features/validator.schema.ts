import * as Joi from 'joi';
import { JoiMongoObjectId } from '../../utils/joi';

export const getFeaturesRequestSchema = Joi.object({
    query: Joi.object({
        _id: JoiMongoObjectId.optional(),
        data: Joi.string().alphanum().optional(),
    }).unknown(),
    body: {},
    params: {},
});

export const createFeatureRequestSchema = Joi.object({
    body: {
        data: Joi.string().alphanum().required(),
    },
    query: {},
    params: {},
});

export const sendRabbitMessageRequestSchema = Joi.object({
    body: {
        message: Joi.string().required(),
    },
    query: {},
    params: {},
});

const objectActionParamsSchema = Joi.object({
    bucketName: Joi.string().required(),
    objectName: Joi.string().required(),
});

export const uploadFileRequestSchema = Joi.object({
    headers: Joi.object({
        'content-type': Joi.string()
            .regex(/.*multipart\/form-data.*boundary.*/)
            .required(),
    }).unknown(),
    query: {},
    params: objectActionParamsSchema,
    body: {},
});

export const downloadFileRequestSchema = Joi.object({
    query: {},
    params: objectActionParamsSchema,
    body: {},
});

export const deleteFileRequestSchema = Joi.object({
    query: {},
    params: objectActionParamsSchema,
    body: {},
});

export const searchKartoffelUsersRequestSchema = Joi.object({
    query: {
        query: Joi.string().required(),
    },
    params: {},
    body: {},
});
