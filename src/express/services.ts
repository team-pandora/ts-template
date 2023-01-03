import axios from 'axios';
import config from '../config';
import { applySpikeInterceptors } from '../utils/express/services';

const { url: kartoffelUrl, spikeAudience: kartoffelSpikeAudience, ...kartoffelConfig } = config.kartoffel;

export const kartoffel = axios.create({
    baseURL: `${kartoffelUrl}/api`,
    ...kartoffelConfig,
});

applySpikeInterceptors(kartoffel, kartoffelSpikeAudience);
