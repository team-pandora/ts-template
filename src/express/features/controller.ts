import { Request, Response } from 'express';
import * as FeaturesManager from './manager';

const getFeatures = async (req: Request, res: Response) => {
    res.json(await FeaturesManager.getFeatures(req.query));
};

const createFeature = async (req: Request, res: Response) => {
    res.json(await FeaturesManager.createFeature(req.body));
};

export { getFeatures, createFeature };
