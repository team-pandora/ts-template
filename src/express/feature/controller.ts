import { Request, Response } from 'express';
import FeatureManager from './manager';

const getFeatures = async (req: Request, res: Response) => {
    res.json(await FeatureManager.getFeatures(req.query));
};

const createFeature = async (req: Request, res: Response) => {
    res.json(await FeatureManager.createFeature(req.body));
};

export default {
    getFeatures,
    createFeature,
};
