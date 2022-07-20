import { Router } from 'express';
import wrapMiddleware from '../../utils/express';
import ValidateRequest from '../../utils/joi';
import { shragaAuthMiddleware as shraga, spikeAuthMiddlewareFactory as spike } from '../auth';
import * as FeaturesController from './controller';
import * as FeaturesValidator from './validator';
import { createFeatureRequestSchema, getFeaturesRequestSchema } from './validator.schema';

const featuresRouter: Router = Router();

featuresRouter.get('/', ValidateRequest(getFeaturesRequestSchema), wrapMiddleware(FeaturesController.getFeatures));
featuresRouter.post('/', ValidateRequest(createFeatureRequestSchema), wrapMiddleware(FeaturesController.createFeature));
featuresRouter.get(
    '/hardToValidateWithSchema',
    wrapMiddleware(FeaturesValidator.somethingThatIsImpossibleToValidateWithSchema),
);

/* SHRAGA AUTHENTICATED ROUTE */
featuresRouter.get('/shraga', shraga, wrapMiddleware(FeaturesController.getShraga));

/* SPIKE AUTHENTICATED ROUTE */
featuresRouter.get('/spike', spike(['read']), wrapMiddleware(FeaturesController.getSpike));

export default featuresRouter;
