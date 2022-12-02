import { once } from 'events';
import * as fs from 'fs';

export const fsCreateReadStream = async (...params: Parameters<typeof fs.createReadStream>) => {
    const fileReadStream = fs.createReadStream(...params);
    await once(fileReadStream, 'ready');
    return fileReadStream;
};
