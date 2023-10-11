import config from '../../config';
import { PublicKeyManager } from '../publicKeyManager';

const { publicKey, url } = config.spike;

const PKManager = new PublicKeyManager({ url, ...publicKey });

export const getPK = PKManager.getPublicKey.bind(PKManager);
export const renewPK = PKManager.renewPublicKey.bind(PKManager);
