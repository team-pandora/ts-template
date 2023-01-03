import { once } from 'events';
import * as fs from 'fs';

export const KB = 1000;
export const MB = 1000 * KB;
export const GB = 1000 * MB;
export const TB = 1000 * GB;
export const PB = 1000 * TB;

export const fsCreateReadStream = async (...params: Parameters<typeof fs.createReadStream>) => {
    const fileReadStream = fs.createReadStream(...params);
    await once(fileReadStream, 'ready');
    return fileReadStream;
};
