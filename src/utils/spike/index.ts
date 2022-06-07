import * as jwt from 'jsonwebtoken';
import { isSubsetArray } from '../object';
import { ISpikeJWTValidations, SpikeClient } from './interface';
import { getPK } from './publicKey';

const formatSpikeClient = (payload: any) => ({
    scopes: payload.scope,
    clientId: payload.clientId,
    clientName: payload.clientName,
    issuedAt: new Date(payload.iat * 1000),
    expiration: new Date(payload.exp * 1000),
});

export const validateSpikeJWT = async (token: string, validations: ISpikeJWTValidations): Promise<SpikeClient> => {
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

    return formatSpikeClient(payload);
};
