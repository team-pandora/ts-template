import * as jwt from 'jsonwebtoken';
import config from '../../config';
import { ShragaUser, User } from './interface';

const formatShragaUser = (payload: ShragaUser): User => ({
    id: payload.genesisId,
    adfsId: payload.adfsId,
    firstName: payload.name?.firstName,
    lastName: payload.name?.lastName,
    unit: payload.displayName.split('/').find((unitOrPrefix) => !config.service.unitPrefixes.includes(unitOrPrefix)),
    displayName: payload.displayName,
    mail: payload.email,
    expiration: payload.exp,
    issuedAt: payload.iat,
    relayState: payload.RelayState,
});

export const verifyShragaJwt = async (token: string) => {
    const payload = jwt.verify(token, Buffer.from(config.shraga.secret, 'base64'), {
        clockTimestamp: Date.now() / 1000,
    });

    if (typeof payload !== 'object' || !payload.iat || !payload.exp || !payload.genesisId) {
        throw new Error('Invalid JWT payload');
    }

    return formatShragaUser(payload as ShragaUser);
};
