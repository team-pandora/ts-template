import { StatusCodes } from 'http-status-codes';
import { menash } from 'menashmq';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import config from '../src/config';
import Server from '../src/express/server';

jest.setTimeout(30000);

const removeFeatureCollection = async () =>
    mongoose.connection.collections[config.mongo.featuresCollectionName].deleteMany({});

describe('features tests', () => {
    let app: Express.Application;

    beforeAll(async () => {
        await mongoose.connect(config.mongo.uri);
        await removeFeatureCollection();
        app = Server.createExpressApp();

        const { uri, retryOptions, featuresQueue } = config.rabbit;
        await menash.connect(uri, retryOptions);
        const { name, durable, prefetch } = featuresQueue;
        const queue = await menash.declareQueue(name, { durable });
        await queue.prefetch(prefetch);
        await queue.activateConsumer(async (msg) => msg.ack());
    });

    afterEach(async () => {
        await removeFeatureCollection();
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await menash.close();
    });

    describe('/api/features/mongo', () => {
        describe('POST', () => {
            it('should fail validation for unknown fields', async () => {
                const { status } = await request(app).post('/api/features/mongo').send({ invalidField: 'some value' });
                expect(status).toBe(StatusCodes.BAD_REQUEST);
            });

            it('should fail because of missing fields', async () => {
                const { status } = await request(app).post('/api/features/mongo').send({});
                expect(status).toBe(StatusCodes.BAD_REQUEST);
            });

            it('should fail with duplicate key error', async () => {
                const newFeature = { data: 'someData' };
                const firstRes = await request(app).post('/api/features/mongo').send(newFeature);
                expect(firstRes.status).toBe(StatusCodes.OK);
                const secondRes = await request(app).post('/api/features/mongo').send(newFeature);
                expect(secondRes.status).toBe(StatusCodes.BAD_REQUEST);
            });

            it('should create a feature', async () => {
                const newFeature = { data: 'someData' };
                const { body: createdFeature, status } = await request(app)
                    .post('/api/features/mongo')
                    .send(newFeature);
                expect(status).toBe(StatusCodes.OK);

                expect(mongoose.Types.ObjectId.isValid(createdFeature._id)).toBe(true);
                expect(createdFeature).toMatchObject(newFeature);
                expect(new Date(createdFeature.createdAt).getTime()).toBeCloseTo(Date.now(), -2);
                expect(new Date(createdFeature.updatedAt).getTime()).toBeCloseTo(Date.now(), -2);
            });
        });

        describe('GET', () => {
            it('should return all features', async () => {
                const newFeature = { data: 'someData' };
                const response = await request(app).post('/api/features/mongo').send(newFeature);
                expect(response.status).toBe(StatusCodes.OK);

                const { body: features, status } = await request(app).get('/api/features/mongo');
                expect(status).toBe(StatusCodes.OK);
                expect(features).toHaveLength(1);
                expect(mongoose.Types.ObjectId.isValid(features[0]._id)).toBe(true);
            });
        });
    });

    describe('/api/features/rabbit', () => {
        describe('POST', () => {
            it('should fail validation for unknown fields', async () => {
                const { status } = await request(app).post('/api/features/rabbit').send({ invalidField: 'some value' });
                expect(status).toBe(StatusCodes.BAD_REQUEST);
            });

            it('should fail because of missing fields', async () => {
                const { status } = await request(app).post('/api/features/rabbit').send({});
                expect(status).toBe(StatusCodes.BAD_REQUEST);
            });

            it('should send a rabbit message', async () => {
                const { text, status } = await request(app).post('/api/features/rabbit').send({ message: 'message' });
                expect(status).toBe(StatusCodes.OK);
                expect(text).toBe('Message sent');
            });
        });
    });
});
