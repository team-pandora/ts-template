import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { shragaCallbackMiddleware, shragaLoginMiddleware } from './auth';
import { ServerError } from './error';
import { menash } from 'menashmq';
import mongoose from 'mongoose';
import { healthCheck as minioHealthCheck } from '../utils/minio';
import redisClient from '../utils/redis';
import featuresRouter from './features/router';

const appRouter = Router();

appRouter.use('/api/features', featuresRouter);

/* SHRAGA AUTHENTICATION ROUTES */
appRouter.get('/auth/login', shragaLoginMiddleware); // UI will redirect to this route to login with shraga
appRouter.post('/auth/callback', shragaCallbackMiddleware); // Shraga will redirect to this route after login

appRouter.use('/isAlive', async (_, res: Response) => {
    const servicesStatus = {
        mongo: mongoose.connection.readyState === 1,
        redis: redisClient.isReady,
        rabbit: menash.isReady,
        minio: await minioHealthCheck(),
    };

    const isOk = Object.values(servicesStatus).every((status) => status);

    res.status(isOk ? StatusCodes.OK : StatusCodes.INTERNAL_SERVER_ERROR).json(servicesStatus);
});

appRouter.use('*', (req: Request, _, next: NextFunction) => {
    if (!req.route) {
        next(new ServerError(StatusCodes.NOT_FOUND, 'Invalid route'));
    }
    next();
});

export default appRouter;
