import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import config from '../config';
import wrapMiddleware from '../utils/express';
import logger from '../utils/logger';
import { verifyShragaJwt } from '../utils/shraga';
import { validateSpikeJWT } from '../utils/spike';
import { ISpikeJWTValidations } from '../utils/spike/interface';
import { ServerError } from './error';

const unwrappedSpikeAuthMiddlewareFactory = (scopes: Array<string>) => {
    const validations: ISpikeJWTValidations = {
        audience: config.spike.audience,
        scope: scopes,
        algorithms: ['RS256'],
    };

    return async (req: Request) => {
        const token = req.headers.authorization;
        if (!token) throw new ServerError(StatusCodes.UNAUTHORIZED, 'Missing JWT token in authorization header.');
        req.client = await validateSpikeJWT(token, validations).catch((err) => {
            throw new ServerError(StatusCodes.UNAUTHORIZED, `Failed to validate JWT token: ${err.message}`);
        });
    };
};

const unwrappedShragaAuthMiddleware = async (req: Request) => {
    const token = req.cookies['access-token'] || req.query.access_token;
    if (!token) throw new ServerError(StatusCodes.UNAUTHORIZED, 'Missing JWT access token.');

    req.user = await verifyShragaJwt(token).catch((err) => {
        throw new ServerError(StatusCodes.UNAUTHORIZED, `Failed to validate JWT access token: ${err.message}`);
    });
};

const unwrappedDevShragaAuthMiddleware = async (req: Request) => {
    await unwrappedShragaAuthMiddleware(req);
    if (!config.service.adminIds.includes(req.user.id))
        throw new ServerError(StatusCodes.UNAUTHORIZED, 'Unauthorized user in dev environment');
};

const unwrappedShragaLoginMiddleware = async (req: Request, res: Response) => {
    const { url, defaultCallbackUrl, secret } = config.shraga;
    const { query } = req;

    const { host, scheme } = req.headers;

    const relayState = query.relayState || '/';
    const callbackUrl =
        query.callbackUrl?.toString() ||
        (host && `${scheme?.includes('http') ? scheme : 'http'}://${host}/auth/callback`) ||
        defaultCallbackUrl;

    res.redirect(
        `${url}/setCallback/${encodeURIComponent(callbackUrl)}` +
            `?SignInSecret=${encodeURIComponent(secret)}` +
            `&useEnrichId=true` +
            `&RelayState=${relayState}`,
    );
};

const unwrappedShragaCallbackMiddleware = async (req: Request, res: Response) => {
    const token = req.query.jwt;
    try {
        if (typeof token !== 'string') throw new Error('Missing or Invalid JWT access token in query.');
        const payload = await verifyShragaJwt(token);
        res.cookie('access-token', token, { maxAge: new Date(payload.expiration * 1000).getTime() - Date.now() });
        res.redirect(payload.relayState || '/');
    } catch (err) {
        if (err instanceof Error) logger.warn(`Failed to validate JWT access token: ${err.message}`);
        res.redirect(config.shraga.unauthenticatedRedirectRoute);
    }
};

export const spikeAuthMiddlewareFactory = (scopes: Array<string>) =>
    wrapMiddleware(unwrappedSpikeAuthMiddlewareFactory(scopes));
export const shragaAuthMiddleware = wrapMiddleware(
    config.service.production ? unwrappedShragaAuthMiddleware : unwrappedDevShragaAuthMiddleware,
);
export const shragaLoginMiddleware = wrapMiddleware(unwrappedShragaLoginMiddleware);
export const shragaCallbackMiddleware = wrapMiddleware(unwrappedShragaCallbackMiddleware);
