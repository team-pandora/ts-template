import axios from 'axios';
import * as fs from 'fs/promises';
import logger from './logger';

export interface IPublicKeyManagerConfig {
    url: string;
    path: string;
    downloadRoute: string;
    renewalIntervalMs?: number;
}

export class PublicKeyManager {
    private publicKeyPromise: Promise<string>;

    private path: string;

    private downloadUri: string;

    private renewalInterval: NodeJS.Timer;

    constructor(PKConfig: IPublicKeyManagerConfig) {
        this.path = PKConfig.path;
        this.downloadUri = PKConfig.url + PKConfig.downloadRoute;
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
        const { data: pk } = await axios.get(this.downloadUri).catch((error) => {
            throw new Error(`Failed to download public key at: ${this.downloadUri} - ${error.message}`);
        });

        // No need to await, its ok if this fails
        fs.mkdir(this.path.substring(0, this.path.lastIndexOf('/')) || '.', { recursive: true })
            .then(() => fs.writeFile(this.path, pk))
            .catch((err) => {
                logger.log('warn', `Failed to write public key to file: ${err}`);
            });

        return pk;
    }

    private async loadPublicKey(): Promise<string> {
        return fs.readFile(this.path, 'utf8').catch((error) => {
            if (error.code === 'ENOENT') return this.downloadPublicKey();
            throw error;
        });
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
