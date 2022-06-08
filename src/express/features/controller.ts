import { Request, Response } from 'express';
import * as FeaturesManager from './manager';

export const getFeatures = async (req: Request, res: Response) => {
    res.json(await FeaturesManager.getFeatures(req.query));
};

export const createFeature = async (req: Request, res: Response) => {
    res.json(await FeaturesManager.createFeature(req.body));
};

export const getShraga = async (req: Request, res: Response) => {
    res.json(req.user);
};

export const getSpike = async (req: Request, res: Response) => {
    res.json(req.client);
};
