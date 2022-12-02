import * as jwt from 'jsonwebtoken';

export interface ISpikeJWTValidations {
    audience: string | RegExp;
    scope: Array<string>;
    clientId?: string;
    clientName?: string;
    algorithms?: jwt.Algorithm[];
    issuer?: string;
    subject?: string;
    clockTolerance?: number;
    maxAge?: number | string;
}

export interface SpikeClient {
    aud: string;
    sub: string;
    scope: string[];
    clientId: string;
    clientName: string;
    iat: number;
    exp: number;
    iss: string;
}

export interface Client {
    scopes: Array<string>;
    clientId: string;
    clientName: string;
    issuedAt: Date;
    expiration: Date;
}

// Extend default express namespace to include spike client info
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            client: Client;
        }
    }
}
