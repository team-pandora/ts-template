/* eslint-disable promise/no-callback-in-promise */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';

const wrapMiddleware = (func: (req: Request<any>, res: Response) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        func(req, res).then(next).catch(next);
    };
};

export default wrapMiddleware;
