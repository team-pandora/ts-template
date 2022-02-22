import { once } from 'events';
import * as fs from 'fs';

interface CreateReadStreamOptions {
    flags?: string;
    encoding?: 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex';
    fd?: number;
    mode?: number;
    autoClose?: boolean;
    emitClose?: boolean;
    start?: number;
    end?: number;
    highWaterMark?: number;
}
const fsCreateReadStream = async (path: fs.PathLike, options?: CreateReadStreamOptions) => {
    const fileReadStream = fs.createReadStream(path, options);
    await once(fileReadStream, 'ready');

    return fileReadStream;
};

export default fsCreateReadStream;
