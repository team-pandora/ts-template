import * as jwt from 'jsonwebtoken';
import config from '../../config';

const formatShragaUser = (payload: { [key: string]: any }): any => ({
    id: payload.genesisId,
    adfsId: payload.adfsId,
    firstName: payload.name?.firstName,
    lastName: payload.name?.lastName,
    displayName: payload.displayName,
    mail: payload.email,
    expiration: payload.exp,
    issuedAt: payload.iat,
});

export const verifyShragaJwt = async (token: string, format: boolean = false): Promise<any> => {
    const payload = jwt.verify(token, Buffer.from(config.shraga.secret, 'base64'), {
        clockTimestamp: Date.now() / 1000,
    });

    if (typeof payload !== 'object' || !payload.iat || !payload.exp) {
        throw new Error('Invalid JWT payload');
    }

    return format ? formatShragaUser(payload) : payload;
};
