import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import config from '../config';
import wrapMiddleware from '../utils/express';
import { formatShragaUser, verifyShragaJwt } from '../utils/shraga';
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

    const user = await verifyShragaJwt(token).catch((err) => {
        throw new ServerError(StatusCodes.UNAUTHORIZED, `Failed to validate JWT access token: ${err.message}`);
    });

    req.user = formatShragaUser(user);
};

const unwrappedShragaLoginMiddleware = async (req: Request, res: Response) => {
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

const unwrappedShragaCallbackMiddleware = async (req: Request, res: Response) => {
    const token = req.query.jwt;
    if (!(typeof token === 'string'))
        throw new ServerError(StatusCodes.UNAUTHORIZED, 'Missing or Invalid JWT access token in query.');

    const payload = await verifyShragaJwt(token).catch((err: Error) => {
        throw new ServerError(StatusCodes.UNAUTHORIZED, `Failed to validate JWT access token: ${err.message}`);
    });

    res.cookie('access-token', token);

    res.redirect(payload.RelayState || '/');
};

const spikeAuthMiddlewareFactory = (scopes: Array<string>) =>
    wrapMiddleware(unwrappedSpikeAuthMiddlewareFactory(scopes));
const shragaAuthMiddleware = wrapMiddleware(unwrappedShragaAuthMiddleware);
const shragaLoginMiddleware = wrapMiddleware(unwrappedShragaLoginMiddleware);
const shragaCallbackMiddleware = wrapMiddleware(unwrappedShragaCallbackMiddleware);

export { spikeAuthMiddlewareFactory, shragaAuthMiddleware, shragaLoginMiddleware, shragaCallbackMiddleware };
