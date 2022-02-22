import { Router } from 'express';
import featureRouter from './feature/router';

const appRouter = Router();

appRouter.use('/api', featureRouter);

appRouter.use('/isAlive', (_req, res) => {
    res.status(200).send('alive');
});

appRouter.use('*', (_req, res) => {
    res.status(404).send('Invalid Route');
});

export default appRouter;
