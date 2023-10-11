import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import { ServerError } from '../../express/error';
import logger from '../logger';
import { getSpikeToken } from '../spike';

export const serviceErrorHandler =
    (messagePrefix: string, cleanupFunc?: () => Promise<void>) => (error: AxiosError) => {
        const message = error.response?.data?.message || error.request?.errored?.message || error.message;
        const status = error.response?.status || StatusCodes.INTERNAL_SERVER_ERROR;
        const path = error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown path';

        const errorMessage = `Axios error, ${path} <${status}> ${message || 'internal error'}`;

        if (cleanupFunc) {
            cleanupFunc().catch((err) => {
                logger.log('error', `Error in cleanup function, ${err.message}, ${errorMessage}`);
            });
        }

        throw new ServerError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `${messagePrefix}, internal error`,
            new Error(errorMessage),
        );
    };

export const applySpikeInterceptors = (axiosInstance: AxiosInstance, audience: string, bearer = false) => {
    if (!config.spike.enabled) return;

    const setToken = async (config: AxiosRequestConfig, refresh?: boolean) => {
        config.headers ||= {};
        config.headers.Authorization = `${bearer ? 'Bearer ' : ''}${await getSpikeToken(audience, refresh)}`;
        return config;
    };

    axiosInstance.interceptors.request.use(async (config: AxiosRequestConfig) => setToken(config));
    axiosInstance.interceptors.response.use(undefined, async (error: AxiosError) => {
        if (error.config && error.response?.status === StatusCodes.UNAUTHORIZED) {
            return axios.request(await setToken(error.config, true));
        }
        return Promise.reject(error);
    });
};
