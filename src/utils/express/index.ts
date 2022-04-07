import { NextFunction, Request, Response } from 'express';

export const wrapMiddleware = (func: (req: Request, res: Response, next?: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        func(req, res, next)
            .then(() => next())
            .catch(next);
    };
};
