import config from '../../config';
import PublicKeyManager from '../publicKeyManager';

const PKManager = new PublicKeyManager(config.spike.publicKey);

export const getPK = PKManager.getPublicKey.bind(PKManager);
export const renewPK = PKManager.renewPublicKey.bind(PKManager);
