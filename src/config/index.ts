import * as env from 'env-var';
import './dotenv';

const config = {
    service: {
        port: env.get('PORT').required().asPortNumber(),
        useCors: env.get('USE_CORS').default('false').asBool(),
        kartoffelUrl: env.get('KARTOFFEL_URL').asString(),
        linkSecret: env.get('LINK_SECRET').required().asString(),
        spikeClientsApiScope: env.get('SPIKE_CLIENTS_API_SCOPE').required().asString(),
    },
    TransfersCrud: {
        url: env.get('TRANSFERS_CRUD_URL').asString(),
        timeout: env.get('TRANSFERS_CRUD_TIMEOUT').default('10000').asInt(),
        maxContentLength: env.get('TRANSFERS_CRUD_MAX_CONTENT_LENGTH').default('1000000000000').asInt(),
        maxBodyLength: env.get('TRANSFERS_CRUD_MAX_CONTENT_LENGTH').default('1000000000000').asInt(),
    },
    storageService: {
        url: env.get('STORAGE_SERVICE_URL').asString(),
        timeout: env.get('STORAGE_SERVICE_TIMEOUT').default('10000').asInt(),
        maxContentLength: env.get('TRANSFERS_CRUD_MAX_CONTENT_LENGTH').default('1000000000').asInt(),
        maxBodyLength: env.get('TRANSFERS_CRUD_MAX_CONTENT_LENGTH').default('1000000000').asInt(),
    },
    mongo: {
        uri: env.get('MONGO_URI').required().asUrlString(),
        featuresCollectionName: env.get('MONGO_FEATURES_COLLECTION_NAME').required().asString(),
    },
    rabbit: {
        uri: env.get('RABBIT_URI').required().asUrlString(),
        retryOptions: {
            minTimeout: env.get('RABBIT_RETRY_MIN_TIMEOUT').default(1000).asIntPositive(),
            retries: env.get('RABBIT_RETRY_RETRIES').default(10).asIntPositive(),
            factor: env.get('RABBIT_RETRY_FACTOR').default(1.8).asFloatPositive(),
        },
    },
    spike: {
        enabled: env.get('SPIKE_ENABLED').required().asBool(),
        audience: env.get('SPIKE_AUDIENCE').required().asString(),
        publicKey: {
            path: env.get('SPIKE_PUBLIC_KEY_PATH').default('./certificate/publicKey.pem').asString(),
            downloadUri: env.get('SPIKE_PUBLIC_KEY_DOWNLOAD_URI').required().asUrlString(),
            renewalIntervalMs: env.get('SPIKE_PUBLIC_KEY_RENEWAL_INTERVAL_MS').default('0').asInt(),
        },
    },
    shraga: {
        enabled: env.get('SHRAGA_ENABLED').required().asBool(),
        url: env.get('SHRAGA_URL').required().asString(),
        secret: env.get('SHRAGA_SECRET').default('secret').asString(),
        callbackUrl: env.get('SHRAGA_CALLBACK_URL').required().asString(),
    },
};

export default config;
