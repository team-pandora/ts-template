import config from '../../config';
import PublicKeyManager from '../publicKeyManager';

const PKManager = new PublicKeyManager({
    path: config.spike.publicKey.path,
    downloadUrl: config.spike.publicKey.downloadUrl,
});

export const getPK = PKManager.getPublicKey.bind(PKManager);
export const renewPK = PKManager.renewPublicKey.bind(PKManager);
