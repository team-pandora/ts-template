import * as env from 'env-var';
import { MB } from '../utils/fs';
import { MIN, SEC } from '../utils/time';
import './dotenv';

const config = {
    service: {
        production: env.get('PRODUCTION').default('false').asBool(),
        port: env.get('PORT').required().asPortNumber(),
        useCors: env.get('USE_CORS').default('false').asBool(),
        testBucket: env.get('TEST_BUCKET').default('test').asString(),
        adminIds: env.get('ADMIN_IDS').default('').asArray(),
        logsDir: env.get('LOGS_DIR').default('./logs').asString(),
        unitPrefixes: env.get('UNIT_PREFIXES').default('CTS').asArray(),
        maxFileSizeInBytes: env
            .get('MAX_FILE_SIZE_IN_BYTES')
            .default(10 * MB)
            .asInt(),
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
    redis: {
        uri: env.get('REDIS_URI').required().asString(),
    },
    spike: {
        enabled: env.get('SPIKE_ENABLED').default('true').asBool(),
        url: env.get('SPIKE_URL').required().asString(),
        clientId: env.get('SPIKE_CLIENT_ID').required().asString(),
        clientSecret: env.get('SPIKE_CLIENT_SECRET').required().asString(),
        audience: env.get('SPIKE_AUDIENCE').required().asString(),
        getTokenRoute: env.get('SPIKE_GET_TOKEN_ROUTE').default('/oauth2/token').asString(),
        redisTokenPrefix: env.get('SPIKE_REDIS_TOKEN_PREFIX').default('spike-').asString(),
        getTokenTimeout: env.get('SPIKE_TOKEN_EXPIRATION_OFFSET').default(MIN).asInt(),
        pollingRate: env.get('SPIKE_POLLING_RATE').default(SEC).asInt(),
        publicKey: {
            path: env.get('SPIKE_PUBLIC_KEY_PATH').default('./certificate/publicKey.pem').asString(),
            downloadRoute: env.get('SPIKE_PUBLIC_KEY_DOWNLOAD_ROUTE').default('/.well-known/publickey.pem').asString(),
            renewalIntervalMs: env.get('SPIKE_PUBLIC_KEY_RENEWAL_INTERVAL_MS').default('0').asInt(),
        },
    },
    shraga: {
        url: env.get('SHRAGA_URL').required().asString(),
        secret: env.get('SHRAGA_SECRET').default('secret').asString(),
        defaultCallbackUrl: env.get('SHRAGA_DEFAULT_CALLBACK_URL').required().asString(),
        unauthenticatedRedirectRoute: env.get('SHRAGA_UNAUTHENTICATED_REDIRECT_ROUTE').default('/forbidden').asString(),
    },
    kartoffel: {
        url: env.get('KARTOFFEL_URL').required().asString(),
        spikeAudience: env.get('KARTOFFEL_SPIKE_AUDIENCE').default('kartoffel').asString(),
        timeout: env.get('KARTOFFEL_TIMEOUT').default(MIN).asInt(),
        maxContentLength: env.get('KARTOFFEL_MAX_CONTENT_LENGTH').default(MB).asInt(),
        maxBodyLength: env.get('KARTOFFEL_MAX_BODY_LENGTH').default(MB).asInt(),
    },
};

export default config;
