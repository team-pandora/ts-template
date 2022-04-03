import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import config from '../config';
import { wrapMiddleware } from '../utils/express';
import { formatShragaUser, verifyShragaJwt } from '../utils/shraga';
import { validateSpikeJWT } from '../utils/spike';
import { ISpikeJWTValidations } from '../utils/spike/interface';
import { ServerError } from './error';

const spikeAuthMiddlewareFactory = (scopes: Array<string>) => {
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

const shragaAuthMiddleware = async (req: Request) => {
    if (!config.shraga.enabled) return;

    const token = req.cookies['access-token'];
    if (!token) throw new ServerError(StatusCodes.UNAUTHORIZED, 'Missing JWT access token.');

    const user = await verifyShragaJwt(token).catch((err) => {
        throw new ServerError(StatusCodes.UNAUTHORIZED, `Failed to validate JWT access token: ${err.message}`);
    });

    req.user = formatShragaUser(user);
};

const authMiddlewareFactory = (scopes: Array<string>) => {
    if (!config.shraga.enabled || !config.spike.enabled) return async () => {};

    return async (req: Request) => {
        const spikeToken = req.headers.authorization;
        const shragaToken = req.cookies['access-token'];

        if (spikeToken && shragaToken)
            throw new ServerError(
                StatusCodes.BAD_REQUEST,
                'Both shraga and spike auth headers were provided. Please choose one.',
            );
        if (!spikeToken && !shragaToken)
            throw new ServerError(
                StatusCodes.UNAUTHORIZED,
                'No shraga or spike auth headers were provided. Please choose one.',
            );

        if (spikeToken) await spikeAuthMiddlewareFactory(scopes)(req);
        if (shragaToken) await shragaAuthMiddleware(req);
    };
};

const shragaLoginMiddleware = async (req: Request, res: Response) => {
    const { relayState } = req.query;
    if (!(typeof relayState === 'string'))
        throw new ServerError(StatusCodes.BAD_REQUEST, 'Missing or Invalid RelayState in query.');

    const { URL, callbackURL, secret } = config.shraga;
    res.redirect(
        `${URL}/setCallback/${encodeURIComponent(callbackURL)}` +
            `?SignInSecret=${encodeURIComponent(secret)}` +
            `&useEnrichId=true` +
            `&RelayState=${relayState}`,
    );
};

const shragaCallbackMiddleware = async (req: Request, res: Response) => {
    const token = req.query.jwt;
    if (!(typeof token === 'string'))
        throw new ServerError(StatusCodes.UNAUTHORIZED, 'Missing or Invalid JWT access token in query.');

    const payload = await verifyShragaJwt(token).catch((err: Error) => {
        throw new ServerError(StatusCodes.UNAUTHORIZED, `Failed to validate JWT access token: ${err.message}`);
    });

    res.cookie('access-token', token);

    res.redirect(payload.RelayState || '/');
};

const wrappedSpikeAuthMiddlewareFactory = (scopes: Array<string>) => wrapMiddleware(spikeAuthMiddlewareFactory(scopes));
const wrappedShragaAuthMiddleware = wrapMiddleware(shragaAuthMiddleware);
const wrappedAuthMiddlewareFactory = (scopes: Array<string>) => wrapMiddleware(authMiddlewareFactory(scopes));
const wrappedShragaLoginMiddleware = wrapMiddleware(shragaLoginMiddleware);
const wrappedShragaCallbackMiddleware = wrapMiddleware(shragaCallbackMiddleware);

export {
    wrappedSpikeAuthMiddlewareFactory as spikeAuthMiddlewareFactory,
    wrappedShragaAuthMiddleware as shragaAuthMiddleware,
    wrappedAuthMiddlewareFactory as authMiddlewareFactory,
    wrappedShragaLoginMiddleware as shragaLoginMiddleware,
    wrappedShragaCallbackMiddleware as shragaCallbackMiddleware,
};
