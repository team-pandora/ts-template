import { Router } from 'express';
import { wrapController, wrapValidator } from '../../utils/express';
import ValidateRequest from '../../utils/joi';
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

export default featuresRouter;
