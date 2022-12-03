import * as Minio from 'minio';
import config from '../../config';

export const minioCopyConditions = new Minio.CopyConditions();

export default new Minio.Client(config.minio);
