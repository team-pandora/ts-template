export interface ShragaUser {
    id: string;
    adfsId: string;
    genesisId: string;
    name: { firstName: string; lastName: string };
    email: string;
    displayName: string;
    upn: string;
    provider: string;
    entityType: string;
    job: string;
    phoneNumbers: string[];
    clearance: string;
    photo: string;
    RelayState: string;
    jti: string;
    iat: number;
    exp: number;
}

export interface User {
    id: string;
    adfsId: string;
    firstName: string;
    lastName: string;
    unit: string | undefined;
    displayName: string;
    mail: string;
    expiration: number;
    issuedAt: number;
    relayState: string;
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        export interface Request {
            user: User;
        }
    }
}
