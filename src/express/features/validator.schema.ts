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
