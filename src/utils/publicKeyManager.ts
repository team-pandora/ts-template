import axios from 'axios';
import * as fs from 'fs';

const fsPromises = fs.promises;

export interface IPublicKeyManagerConfig {
    path: string;
    downloadUri: string;
    renewalIntervalMs?: number;
}

export class PublicKeyManager {
    private publicKeyPromise: Promise<string>;

    private path: string;

    private downloadUri: string;

    private renewalInterval: NodeJS.Timer;

    constructor(PKConfig: IPublicKeyManagerConfig) {
        this.path = PKConfig.path;
        this.downloadUri = PKConfig.downloadUri;
        if (Number(PKConfig.renewalIntervalMs) > 0) {
            this.renewalInterval = setInterval(this.renewPublicKey.bind(this), PKConfig.renewalIntervalMs);
        }
        this.reloadPublicKey();
    }

    public destroy() {
        if (this.renewalInterval) {
            clearInterval(this.renewalInterval);
        }
    }

    private async downloadPublicKey(): Promise<string> {
        const { status, data: pk } = await axios.get(this.downloadUri);

        if (status !== 200) {
            throw new Error(`Failed to download public key at: ${this.downloadUri}`);
        }

        // No need to await, its ok if this fails
        fsPromises
            .mkdir(this.path.substring(0, this.path.lastIndexOf('/')) || '.', { recursive: true })
            .then(() => fsPromises.writeFile(this.path, pk));

        return pk;
    }

    private async loadPublicKey(): Promise<string> {
        try {
            return await fsPromises.readFile(this.path, 'utf8');
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                return this.downloadPublicKey();
            }
            throw error;
        }
    }

    public async reloadPublicKey() {
        this.publicKeyPromise = this.loadPublicKey();
        return this.publicKeyPromise;
    }

    public renewPublicKey() {
        this.publicKeyPromise = this.downloadPublicKey();
        return this.publicKeyPromise;
    }

    public async getPublicKey(): Promise<string> {
        return this.publicKeyPromise;
    }
}

export default PublicKeyManager;
