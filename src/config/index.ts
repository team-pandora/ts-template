import * as env from 'env-var';
import './dotenv';

const config = {
    service: {
        port: env.get('PORT').required().asPortNumber(),
        useCors: env.get('USE_CORS').default('false').asBool(),
    },
    mongo: {
        uri: env.get('MONGO_URI').required().asString(),
        featuresCollectionName: env.get('MONGO_FEATURES_COLLECTION_NAME').required().asString(),
    },
    rabbit: {
        uri: env.get('RABBIT_URI').required().asString(),
        retryOptions: {
            minTimeout: env.get('RABBIT_RETRY_MIN_TIMEOUT').default(1000).asIntPositive(),
            retries: env.get('RABBIT_RETRY_RETRIES').default(10).asIntPositive(),
            factor: env.get('RABBIT_RETRY_FACTOR').default(1.8).asFloatPositive(),
        },
        featuresQueue: {
            name: env.get('RABBIT_FEATURES_QUEUE_NAME').required().asString(),
            durable: env.get('RABBIT_FEATURES_QUEUE_DURABLE').default('true').asBool(),
            prefetch: env.get('RABBIT_FEATURES_QUEUE_PREFETCH').default(1).asIntPositive(),
        },
    },
    minio: {
        endPoint: env.get('MINIO_ENDPOINT').required().asString(),
        port: env.get('MINIO_PORT').default(9000).asPortNumber(),
        region: env.get('MINIO_REGION').default('region').asString(),
        accessKey: env.get('MINIO_ROOT_USER').default('minio').asString(),
        secretKey: env.get('MINIO_ROOT_PASSWORD').default('minio123').asString(),
        useSSL: env.get('MINIO_USE_SSL').default('false').asBool(),
        partSize: env
            .get('MINIO_PART_SIZE')
            .default(10 * 1000 * 1000)
            .asInt(),
    },
    spike: {
        audience: env.get('SPIKE_AUDIENCE').required().asString(),
        publicKey: {
            path: env.get('SPIKE_PUBLIC_KEY_PATH').default('./certificate/publicKey.pem').asString(),
            downloadUri: env.get('SPIKE_PUBLIC_KEY_DOWNLOAD_URI').required().asUrlString(),
            renewalIntervalMs: env.get('SPIKE_PUBLIC_KEY_RENEWAL_INTERVAL_MS').default('0').asInt(),
        },
    },
    shraga: {
        url: env.get('SHRAGA_URL').required().asString(),
        secret: env.get('SHRAGA_SECRET').default('secret').asString(),
        callbackUrl: env.get('SHRAGA_CALLBACK_URL').required().asString(),
    },
};

export default config;
