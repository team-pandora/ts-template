import menash from 'menashmq';
import * as mongoose from 'mongoose';
import config from './config';
import Server from './express/server';
import logger from './utils/logger';

const { mongo, rabbit, service } = config;

const initializeMongo = async () => {
    logger.log('info', 'Connecting to Mongo...');

    await mongoose.connect(mongo.uri);

    logger.log('info', 'Mongo connected');
};

const initializeRabbit = async () => {
    const { uri, retryOptions, featuresQueue } = rabbit;

    logger.log('info', 'Connecting to Rabbit...');

    await menash.connect(uri, retryOptions);

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

const main = async () => {
    await initializeMongo();

    await initializeRabbit();

    const server = new Server(service.port);

    await server.start();

    logger.log('info', `Server started on port: ${service.port}`);
};

main().catch((err) => logger.log('error', err));
