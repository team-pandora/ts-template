import { Request, Response } from 'express';
import FeatureManager from './manager';

const getFolders = async (req: Request, res: Response) => {
    res.json(await FeatureManager.getFolders(req.query));
};

const createFolder = async (req: Request, res: Response) => {
    res.json(await FeatureManager.createFolder(req.body));
};

export default {
    getFolders,
    createFolder,
};
