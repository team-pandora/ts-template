import config from '../../config';
import { PublicKeyManager } from '../publicKeyManager';

const PKManager = new PublicKeyManager({
    path: config.spike.publicKey.path,
    downloadUrl: config.spike.publicKey.downloadUrl,
});
const getPK = PKManager.getPublicKey.bind(PKManager);
const renewPK = PKManager.renewPublicKey.bind(PKManager);

export { getPK, renewPK };
