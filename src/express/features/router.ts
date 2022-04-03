import { Router } from 'express';
import { wrapController, wrapValidator } from '../../utils/express';
import ValidateRequest from '../../utils/joi';
import { authMiddlewareFactory, shragaAuthMiddleware, spikeAuthMiddlewareFactory } from '../auth';
import * as FeaturesController from './controller';
import * as FeaturesValidator from './validator';
import { createFeatureRequestSchema, getFeatureRequestSchema } from './validator.schema';

const featuresRouter: Router = Router();

featuresRouter.get('/', ValidateRequest(getFeatureRequestSchema), wrapController(FeaturesController.getFeatures));
featuresRouter.post('/', ValidateRequest(createFeatureRequestSchema), wrapController(FeaturesController.createFeature));
featuresRouter.get(
    '/hardToValidateWithSchema',
    wrapValidator(FeaturesValidator.somethingThatIsImpossibleToValidateWithSchema),
);

/** ******* SHRAGA AUTHENTICATED ROUTE ******** */
featuresRouter.get('/shraga', shragaAuthMiddleware, wrapController(FeaturesController.getShraga));

/** ******* SPIKE AUTHENTICATED ROUTE ******** */
featuresRouter.get('/spike', spikeAuthMiddlewareFactory(['read']), wrapController(FeaturesController.getSpike));

/** ******* SPIKE OR SHRAGA AUTHENTICATED ROUTE ******** */
featuresRouter.get('/auth', authMiddlewareFactory(['read']), wrapController(FeaturesController.getAuth));

export default featuresRouter;
