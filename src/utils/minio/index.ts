import { StatusCodes } from 'http-status-codes';
import { Readable } from 'stream';
import config from '../../config';
import { ServerError } from '../../express/error';
import minioClient, { minioCopyConditions } from './client';
import handleMinioError from './error';

const { region } = config.minio;

export const ensureBucket = async (bucketName: string) => {
    return minioClient.makeBucket(bucketName, region).catch((err) => {
        if (err.code !== 'BucketAlreadyOwnedByYou') {
            throw new ServerError(StatusCodes.INTERNAL_SERVER_ERROR, `Error creating bucket, ${err.message}`, err);
        }
    });
};

export const deleteBucket = async (bucketName: string) => {
    return minioClient.removeBucket(bucketName).catch((err) => {
        if (err.code !== 'NoSuchBucket') {
            throw new ServerError(StatusCodes.INTERNAL_SERVER_ERROR, `Error deleting bucket, ${err.message}`, err);
        }
    });
};

export const statFile = async (bucketName: string, objectName: string) => {
    return minioClient.statObject(bucketName, objectName).catch(handleMinioError);
};

export const uploadFile = async (bucketName: string, objectName: string, stream: string | Buffer | Readable) => {
    await ensureBucket(bucketName);
    return minioClient.putObject(bucketName, objectName, stream).catch(handleMinioError);
};

export const downloadFile = async (bucketName: string, objectName: string) => {
    return minioClient.getObject(bucketName, objectName).catch(handleMinioError);
};

export const deleteFile = async (bucketName: string, objectName: string) => {
    return minioClient.removeObject(bucketName, objectName).catch(handleMinioError);
};

export const deleteFiles = async (bucketName: string, objectNames: string[]) => {
    return minioClient.removeObjects(bucketName, objectNames).catch(handleMinioError);
};

export const copyFile = async (
    sourceBucketName: string,
    sourceObjectName: string,
    destBucketName: string,
    destObjectName: string,
) => {
    await ensureBucket(sourceBucketName);
    await ensureBucket(destBucketName);

    await minioClient
        .copyObject(destBucketName, destObjectName, `${sourceBucketName}/${sourceObjectName}`, minioCopyConditions)
        .catch(handleMinioError);
};

export const fileExists = async (bucketName: string, objectName: string) => {
    return minioClient
        .statObject(bucketName, objectName)
        .then(() => true)
        .catch((err) => {
            if (['NoSuchBucket', 'NoSuchObject', 'NotFound'].includes(err.code)) return false;
            return handleMinioError(err);
        });
};
