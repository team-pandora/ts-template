import menash, { ConsumerMessage } from 'menashmq';
import * as mongoose from 'mongoose';
import config from './config';
import Server from './express/server';
import logger from './utils/logger';

const { mongo, rabbit, service } = config;

const initializeMongo = async () => {
    logger.log('info', 'Connecting to Mongo...');

    await mongoose.connect(mongo.uri);

    logger.log('info', 'Mongo connection established');
};

const initializeRabbit = async () => {
    logger.log('info', 'Connecting to Rabbit...');

    await menash.connect(rabbit.uri, rabbit.retryOptions);

    logger.log('info', 'Rabbit connected');

    const featureConsumeFunction = (msg: ConsumerMessage) => {
        logger.log('info', 'Received message: ', msg.getContent());
    };

    await menash.declareTopology({
        queues: [{ name: 'feature-queue', options: { durable: true } }],
        exchanges: [{ name: 'feature-exchange', type: 'fanout', options: { durable: true } }],
        bindings: [{ source: 'feature-exchange', destination: 'feature-queue' }],
        consumers: [{ queueName: 'feature-queue', onMessage: featureConsumeFunction }],
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
