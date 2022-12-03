import { StatusCodes } from 'http-status-codes';
import { ServerError } from '../../express/error';

const handleMinioError = (err: Error & { code: string }) => {
    switch (err.code) {
        case 'NoSuchKey':
            throw new ServerError(StatusCodes.NOT_FOUND, 'The specified file does not exist.', err);
        case 'NoSuchBucket':
            throw new ServerError(StatusCodes.NOT_FOUND, 'The specified bucket does not exist.', err);
        case 'NotFound':
            throw new ServerError(StatusCodes.NOT_FOUND, 'The specified file does not exist.', err);
        default:
            throw new ServerError(StatusCodes.INTERNAL_SERVER_ERROR, `Minio operation failed: ${err.message}`, err);
    }
};

export default handleMinioError;
