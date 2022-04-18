import { NextFunction, Request, Response } from 'express';

const wrapMiddleware = (func: (req: Request<any>, res: Response, next?: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        func(req, res, next)
            .then(() => next())
            .catch(next);
    };
};

export default wrapMiddleware;
