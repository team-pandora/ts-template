import { Router } from 'express';
import { wrapController, wrapValidator } from '../../utils/express';
import ValidateRequest from '../../utils/joi';
import FeatureController from './controller';
import FeatureValidator from './validator';
import { createFeatureRequestSchema, getFeatureRequestSchema } from './validator.schema';

const featureRouter: Router = Router();

featureRouter.get('/features', ValidateRequest(getFeatureRequestSchema), wrapController(FeatureController.getFeatures));
featureRouter.post(
    '/features',
    ValidateRequest(createFeatureRequestSchema),
    wrapController(FeatureController.createFeature),
);
featureRouter.get(
    '/features/hardToValidateWithSchema',
    wrapValidator(FeatureValidator.somethingThatIsImpossibleToValidateWithSchema),
);

export default featureRouter;
