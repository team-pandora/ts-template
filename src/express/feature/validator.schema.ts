import * as Joi from 'joi';

// GET /api/forlders?name=test1
export const getFoldersRequestSchema = Joi.object({
    query: {
        name: Joi.string().alphanum(),
        folderId: Joi.string().uuid(),
    },
    body: {},
    params: {},
});

// POST /api/folders/
export const createFolderRequestSchema = Joi.object({
    body: {
        name: Joi.string().alphanum().required(),
    },
    query: {},
    params: {},
});
