/* eslint-disable no-console */
import menash, { ConsumerMessage } from 'menashmq';
import * as mongoose from 'mongoose';
import config from './config';
import Server from './express/server';

const { mongo, rabbit, service } = config;

const initializeMongo = async () => {
    console.log('Connecting to Mongo...');

    await mongoose.connect(mongo.uri);

    console.log('Mongo connection established');
};

const initializeRabbit = async () => {
    console.log('Connecting to Rabbit...');

    await menash.connect(rabbit.uri, rabbit.retryOptions);

    console.log('Rabbit connected');

    const featureConsumeFunction = (msg: ConsumerMessage) => {
        console.log('Received message: ', msg.getContent());
    };

    await menash.declareTopology({
        queues: [{ name: 'feature-queue', options: { durable: true } }],
        exchanges: [{ name: 'feature-exchange', type: 'fanout', options: { durable: true } }],
        bindings: [{ source: 'feature-exchange', destination: 'feature-queue' }],
        consumers: [{ queueName: 'feature-queue', onMessage: featureConsumeFunction }],
    });

    console.log('Rabbit initialized');
};

const main = async () => {
    await initializeMongo();

    await initializeRabbit();

    const server = new Server(service.port);

    await server.start();

    console.log(`Server started on port: ${service.port}`);
};

main().catch((err) => console.error(err));
