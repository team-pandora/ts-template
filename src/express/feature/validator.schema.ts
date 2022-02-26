import * as Joi from 'joi';

// GET /api/features?data=someData123
export const getFeatureRequestSchema = Joi.object({
    query: {
        data: Joi.string().alphanum(),
        _id: Joi.string().uuid(),
    },
    body: {},
    params: {},
});

// POST /api/features/
export const createFeatureRequestSchema = Joi.object({
    body: {
        data: Joi.string().alphanum().required(),
    },
    query: {},
    params: {},
});
