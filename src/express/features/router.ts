import { Router } from 'express';
import { wrapMiddleware } from '../../utils/express';
import ValidateRequest from '../../utils/joi';
import { authMiddlewareFactory, shragaAuthMiddleware, spikeAuthMiddlewareFactory } from '../auth';
import * as FeaturesController from './controller';
import * as FeaturesValidator from './validator';
import { createFeatureRequestSchema, getFeatureRequestSchema } from './validator.schema';

const featuresRouter: Router = Router();

featuresRouter.get('/', ValidateRequest(getFeatureRequestSchema), wrapMiddleware(FeaturesController.getFeatures));
featuresRouter.post('/', ValidateRequest(createFeatureRequestSchema), wrapMiddleware(FeaturesController.createFeature));
featuresRouter.get(
    '/hardToValidateWithSchema',
    wrapMiddleware(FeaturesValidator.somethingThatIsImpossibleToValidateWithSchema),
);

/** ******* SHRAGA AUTHENTICATED ROUTE ******** */
featuresRouter.get('/shraga', shragaAuthMiddleware, wrapMiddleware(FeaturesController.getShraga));

/** ******* SPIKE AUTHENTICATED ROUTE ******** */
featuresRouter.get('/spike', spikeAuthMiddlewareFactory(['read']), wrapMiddleware(FeaturesController.getSpike));

/** ******* SPIKE OR SHRAGA AUTHENTICATED ROUTE ******** */
featuresRouter.get('/auth', authMiddlewareFactory(['read']), wrapMiddleware(FeaturesController.getAuth));

export default featuresRouter;
