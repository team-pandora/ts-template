import { Router } from 'express';
import wrapMiddleware from '../../utils/express';
import ValidateRequest from '../../utils/joi';
import { shragaAuthMiddleware, spikeAuthMiddlewareFactory } from '../auth';
import * as FeaturesController from './controller';
import * as validator from './validator.schema';

const featuresRouter: Router = Router();

featuresRouter.get(
    '/mongo',
    ValidateRequest(validator.getFeaturesRequestSchema),
    wrapMiddleware(FeaturesController.getFeatures),
);
featuresRouter.post(
    '/mongo',
    ValidateRequest(validator.createFeatureRequestSchema),
    wrapMiddleware(FeaturesController.createFeature),
);

featuresRouter.post(
    '/rabbit',
    ValidateRequest(validator.sendRabbitMessageRequestSchema),
    wrapMiddleware(FeaturesController.sendRabbitMessage),
);

featuresRouter.get(
    '/minio/buckets/:bucketName/objects/:objectName',
    ValidateRequest(validator.downloadFileRequestSchema),
    wrapMiddleware(FeaturesController.downloadFile),
);

featuresRouter.post(
    '/minio/buckets/:bucketName/objects/:objectName',
    ValidateRequest(validator.uploadFileRequestSchema),
    wrapMiddleware(FeaturesController.uploadFile),
);

featuresRouter.delete(
    '/minio/buckets/:bucketName/objects/:objectName',
    ValidateRequest(validator.deleteFileRequestSchema),
    wrapMiddleware(FeaturesController.deleteFile),
);

featuresRouter.get(
    '/kartoffel',
    ValidateRequest(validator.searchKartoffelUsersRequestSchema),
    wrapMiddleware(FeaturesController.searchKartoffelUsers),
);

/* SHRAGA AUTHENTICATED ROUTE */
featuresRouter.get('/shraga', shragaAuthMiddleware, wrapMiddleware(FeaturesController.getShraga));

/* SPIKE AUTHENTICATED ROUTE */
featuresRouter.get('/spike', spikeAuthMiddlewareFactory([]), wrapMiddleware(FeaturesController.getSpike));

export default featuresRouter;
