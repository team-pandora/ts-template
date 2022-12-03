import * as Busboy from 'busboy';
import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Readable } from 'stream';
import { ServerError } from '../../express/error';

export const handleFileUpload = <T>(req: Request, fileHandler: (file: Readable) => Promise<T>) => {
    return new Promise((resolve, reject) => {
        req.on('error', (err) => {
            reject(new ServerError(StatusCodes.INTERNAL_SERVER_ERROR, `Error uploading file, ${err.message}`, err));
        });

        const busboy = Busboy({ headers: req.headers });
        let fileUpload: Promise<T>;

        busboy.on('file', (field, file) => {
            if (field === 'file' && !fileUpload) fileUpload = fileHandler(file).catch(reject) as Promise<T>;
            else file.resume();
        });

        busboy.on('error', (err: Error) => {
            reject(new ServerError(StatusCodes.INTERNAL_SERVER_ERROR, `Error uploading file, ${err.message}`, err));
        });

        busboy.on('finish', () => {
            if (!fileUpload) reject(new ServerError(StatusCodes.BAD_REQUEST, 'No file provided'));
            else fileUpload.then(resolve).catch(reject);
        });

        req.pipe(busboy);
    });
};
