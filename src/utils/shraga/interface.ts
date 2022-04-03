export interface ShragaUser {
    id: string;
    adfsId: string;
    genesisId: string;
    firstName: string;
    lastName: string;
    displayName: string;
    expiration: number;
    issuedAt: number;
}

// Extend default express namespace to include shraga user info
declare global {
    namespace Express {
        export interface User extends ShragaUser {}
        interface Request {
            user: User;
        }
    }
}
