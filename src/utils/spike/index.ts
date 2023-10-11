import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import config from '../../config';
import { isSubsetArray } from '../object';
import redisClient from '../redis';
import { SEC, sleep } from '../time';
import { Client, ISpikeJWTValidations, SpikeClient } from './interface';
import { getPK } from './publicKey';

const { redisTokenPrefix, getTokenTimeout, pollingRate, url, getTokenRoute, clientId, clientSecret } = config.spike;

export const getSpikeToken = async (audience: string, refresh = false) => {
    const tokenKey = `${redisTokenPrefix}token-${audience}`;

    if (!refresh) {
        const savedToken = await redisClient.get(tokenKey);
        if (savedToken) return savedToken;
    }

    const lockKey = `${redisTokenPrefix}lock`;

    const timeoutAt = Date.now() + getTokenTimeout;

    while (!(await redisClient.set(lockKey, 'true', { NX: true, PX: getTokenTimeout }))) {
        if (Date.now() > timeoutAt) throw new Error('Timeout while waiting for token lock');

        await sleep(pollingRate);

        const savedToken = await redisClient.get(tokenKey);
        if (savedToken) return savedToken;
    }

    try {
        await redisClient.del(tokenKey);

        const response = await axios.post(
            `${url}${getTokenRoute}`,
            { grant_type: 'client_credentials', audience },
            {
                headers: { Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}` },
                timeout: getTokenTimeout,
            },
        );

        const { access_token, expires_in } = response.data;

        await redisClient.set(tokenKey, access_token, { PX: expires_in * SEC - getTokenTimeout });

        return access_token;
    } finally {
        await redisClient.del(lockKey);
    }
};

const formatSpikeClient = (payload: SpikeClient): Client => ({
    scopes: payload.scope,
    clientId: payload.clientId,
    clientName: payload.clientName,
    issuedAt: new Date(payload.iat * 1000),
    expiration: new Date(payload.exp * 1000),
});

export const validateSpikeJWT = async (token: string, validations: ISpikeJWTValidations): Promise<Client> => {
    const { scope, clientId, clientName, ...jwtVerifyOptions } = validations;

    const payload = jwt.verify(token, await getPK(), {
        clockTimestamp: Date.now() / 1000,
        ...jwtVerifyOptions,
    });

    if (typeof payload !== 'object' || !payload.iat || !payload.exp) {
        throw new Error('Invalid JWT payload');
    }

    if (clientId && payload.clientId !== clientId) throw new Error('Invalid JWT clientId');

    if (clientName && payload.clientName !== clientName) throw new Error('Invalid JWT clientName');

    if (scope && !(Array.isArray(payload.scope) && isSubsetArray(scope, payload.scope)))
        throw new Error('Invalid JWT scope');

    return formatSpikeClient(payload as SpikeClient);
};
