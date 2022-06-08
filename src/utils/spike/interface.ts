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
    scopes: Array<string>;
    clientId: string;
    clientName: string;
    issuedAt: Date;
    expiration: Date;
}

// Extend default express namespace to include spike client info
declare global {
    namespace Express {
        export interface Client extends SpikeClient {}
        interface Request {
            client: Client;
        }
    }
}
