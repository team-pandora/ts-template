import * as Joi from 'joi';
import { JoiMongoObjectId } from '../../utils/joi';

/**
 * GET /api/features?data=someData123
 */
const getFeaturesRequestSchema = Joi.object({
    query: {
        _id: JoiMongoObjectId.optional(),
        data: Joi.string().alphanum().optional(),
    },
    body: {},
    params: {},
});

/**
 * POST /api/features/
 * { data: 'someData123' }
 */
const createFeatureRequestSchema = Joi.object({
    body: {
        data: Joi.string().alphanum().required(),
    },
    query: {},
    params: {},
});

export { getFeaturesRequestSchema, createFeatureRequestSchema };
