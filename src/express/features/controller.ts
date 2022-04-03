import { Request, Response } from 'express';
import * as FeaturesManager from './manager';

const getFeatures = async (req: Request, res: Response) => {
    res.json(await FeaturesManager.getFeatures(req.query));
};

const createFeature = async (req: Request, res: Response) => {
    res.json(await FeaturesManager.createFeature(req.body));
};

const getShraga = async (req: Request, res: Response) => {
    res.json(req.user);
};

const getSpike = async (req: Request, res: Response) => {
    res.json(req.client);
};

const getAuth = async (req: Request, res: Response) => {
    res.json(req.user || req.client);
};

export { getFeatures, createFeature, getShraga, getSpike, getAuth };
