import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { shragaCallbackMiddleware, shragaLoginMiddleware } from './auth';
import { ServerError } from './error';
import featuresRouter from './features/router';

const appRouter = Router();

appRouter.use('/api/features', featuresRouter);

/* SHRAGA AUTHENTICATION ROUTES */
appRouter.get('/auth/login', shragaLoginMiddleware); // UI will redirect to this route to login with shraga
appRouter.post('/auth/callback', shragaCallbackMiddleware); // Shraga will redirect to this route after login

appRouter.use('/isAlive', (_req, res) => {
    res.status(StatusCodes.OK).send('alive');
});

appRouter.use('*', (_req, res, next) => {
    if (!res.headersSent) {
        next(new ServerError(StatusCodes.NOT_FOUND, 'Invalid route'));
    }
    next();
});

export default appRouter;
