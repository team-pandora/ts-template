import axios from 'axios';
import config from '../config';
import { ServerError } from './error';

export const kartoffelService = axios.create({
    baseURL: `${config.service.kartoffelUrl}/api`,
});
