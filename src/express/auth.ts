import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import config from '../config';
import wrapMiddleware from '../utils/express';
import { verifyShragaJwt } from '../utils/shraga';
import { validateSpikeJWT } from '../utils/spike';
import { ISpikeJWTValidations } from '../utils/spike/interface';
import { ServerError } from './error';

const unwrappedSpikeAuthMiddlewareFactory = (scopes: Array<string>) => {
    if (!config.spike.enabled) return async () => {};

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
    if (!config.shraga.enabled) return;

    const token = req.cookies['access-token'];
    if (!token) throw new ServerError(StatusCodes.UNAUTHORIZED, 'Missing JWT access token.');

    req.user = await verifyShragaJwt(token, true).catch((err) => {
        throw new ServerError(StatusCodes.UNAUTHORIZED, `Failed to validate JWT access token: ${err.message}`);
    });
};

const unwrappedShragaLoginMiddleware = async (req: Request, res: Response) => {
    const { relayState } = req.query;
    if (!(typeof relayState === 'string'))
        throw new ServerError(StatusCodes.BAD_REQUEST, 'Missing or Invalid RelayState in query.');

    const { url, callbackUrl, secret } = config.shraga;
    res.redirect(
        `${url}/setCallback/${encodeURIComponent(callbackUrl)}` +
            `?SignInSecret=${encodeURIComponent(secret)}` +
            `&useEnrichId=true` +
            `&RelayState=${relayState}`,
    );
};

const unwrappedShragaCallbackMiddleware = async (req: Request, res: Response) => {
    const token = req.query.jwt;
    if (!(typeof token === 'string'))
        throw new ServerError(StatusCodes.UNAUTHORIZED, 'Missing or Invalid JWT access token in query.');

    const payload = await verifyShragaJwt(token).catch((err: Error) => {
        throw new ServerError(StatusCodes.UNAUTHORIZED, `Failed to validate JWT access token: ${err.message}`);
    });

    res.cookie('access-token', token, { maxAge: new Date(payload.exp * 1000).getTime() - Date.now() });

    res.redirect(payload.RelayState || '/');
};

export const spikeAuthMiddlewareFactory = (scopes: Array<string>) =>
    wrapMiddleware(unwrappedSpikeAuthMiddlewareFactory(scopes));
export const shragaAuthMiddleware = wrapMiddleware(unwrappedShragaAuthMiddleware);
export const shragaLoginMiddleware = wrapMiddleware(unwrappedShragaLoginMiddleware);
export const shragaCallbackMiddleware = wrapMiddleware(unwrappedShragaCallbackMiddleware);
