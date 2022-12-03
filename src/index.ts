import menash from 'menashmq';
import * as mongoose from 'mongoose';
import config from './config';
import Server from './express/server';
import logger from './utils/logger';
import minioClient from './utils/minio/client';

const { mongo, rabbit, service } = config;

const initializeMongo = async () => {
    logger.log('info', 'Connecting to Mongo...');

    await mongoose.connect(mongo.uri).catch((err) => {
        throw new Error(`Error connecting to Mongo: ${err.message}`);
    });

    logger.log('info', 'Mongo connected');
};

const initializeRabbit = async () => {
    const { uri, retryOptions, featuresQueue } = rabbit;

    logger.log('info', 'Connecting to Rabbit...');

    await menash.connect(uri, retryOptions).catch((err) => {
        throw new Error(`Error connecting to Rabbit: ${err.message}`);
    });

    logger.log('info', 'Rabbit connected');

    const { name, durable, prefetch } = featuresQueue;

    const queue = await menash.declareQueue(name, { durable });
    await queue.prefetch(prefetch);
    await queue.activateConsumer(async (msg) => {
        logger.log('info', `Received message from Rabbit: ${msg.getContent()}`);
        msg.ack();
    });

    logger.log('info', 'Rabbit initialized');
};

const initializeMinio = async () => {
    logger.log('info', 'Connecting to Minio...');

    await minioClient.bucketExists('test').catch((err) => {
        throw new Error(`Error connecting to Minio: ${err.message}`);
    });

    logger.log('info', 'Minio initialized');
};

const main = async () => {
    await initializeMongo();

    await initializeRabbit();

    await initializeMinio();

    const server = new Server(service.port);

    await server.start();

    logger.log('info', `Server started on port: ${service.port}`);
};

main().catch((err) => logger.log('error', err));
