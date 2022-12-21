import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { finished } from 'stream/promises';
import { handleFileUpload } from '../../utils/express/file';
import * as minio from '../../utils/minio';
import * as FeaturesManager from './manager';

export const getFeatures = async (req: Request, res: Response) => {
    res.json(await FeaturesManager.getFeatures(req.query));
};

export const createFeature = async (req: Request, res: Response) => {
    res.json(await FeaturesManager.createFeature(req.body));
};

export const sendRabbitMessage = async (req: Request, res: Response) => {
    await FeaturesManager.sendRabbitMessage(req.body.message);

    res.send('Message sent');
};

export const uploadFile = async (req: Request, res: Response) => {
    const { bucketName, objectName } = req.params;

    await handleFileUpload(req, (file) => minio.uploadFile(bucketName, objectName, file));

    res.status(StatusCodes.OK).send({ bucketName, objectName });
};

export const downloadFile = async (req: Request, res: Response) => {
    const { bucketName, objectName } = req.params;

    res.attachment(objectName);

    const fileStream = await minio.downloadFile(bucketName, objectName);
    fileStream.pipe(res);

    await finished(fileStream);
};

export const deleteFile = async (req: Request, res: Response) => {
    const { bucketName, objectName } = req.params;

    await minio.deleteFile(bucketName, objectName);

    res.status(StatusCodes.OK).send({ bucketName, objectName });
};

export const searchKartoffelUsers = async (req: Request, res: Response) => {
    res.json(await FeaturesManager.searchKartoffelUsers(req.query.query as string));
};

export const getShraga = async (req: Request, res: Response) => {
    res.json(req.user);
};

export const getSpike = async (req: Request, res: Response) => {
    res.json(req.client);
};
