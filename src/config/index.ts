import * as env from 'env-var';
import './dotenv';

const config = {
    service: {
        port: env.get('PORT').required().asPortNumber(),
        useCors: env.get('USE_CORS').default('false').asBool(),
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
        audience: env.get('SPIKE_AUDIENCE').default('2rYAQb~MpuJ5JDk~yBc2tk6wgajjPy').asString(),
        publicKey: {
            path: env.get('SPIKE_PUBLIC_KEY_PATH').default('./certificate/publicKey.pem').asString(),
            downloadUrl: env
                .get('SPIKE_PUBLIC_KEY_DOWNLOAD_URL')
                .default('https://ospike.northeurope.cloudapp.azure.com/.well-known/publickey.pem')
                .asUrlString(),
            renewalIntervalMs: env.get('SPIKE_PUBLIC_KEY_RENEWAL_INTERVAL_MS').default('0').asInt(),
        },
    },
    shraga: {
        enabled: env.get('SHRAGA_ENABLED').required().asBool(),
        URL: env.get('SHRAGA_URL').default('https://shraga.shraga.branch-yesodot.org').asString(),
        secret: env.get('SHRAGA_SECRET').default('secret').required().asString(),
        callbackURL: env
            .get('SHRAGA_CALLBACK_URL')
            .default(`http://localhost:${env.get('PORT').asPortNumber()}/auth/callback`)
            .asString(),
    },
};

export default config;
