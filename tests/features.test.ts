/* eslint-disable no-underscore-dangle */
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
    });

    afterEach(async () => {
        await removeFeatureCollection();
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('/api/features', () => {
        describe('POST', () => {
            it('should fail validation for unknown fields', () => {
                return request(app).post('/api/features').send({ invalidField: 'some value' }).expect(400);
            });

            it('should fail because of missing fields ', async () => {
                return request(app).post('/api/features').send({}).expect(400);
            });

            it('should fail with duplicate key error ', async () => {
                const newFeature = { data: 'someData' };
                await request(app).post('/api/features').send(newFeature).expect(200);
                await request(app).post('/api/features').send(newFeature).expect(400);
            });

            it('should create a feature', async () => {
                const newFeature = { data: 'someData' };
                const { body: createdFeature } = await request(app).post('/api/features').send(newFeature).expect(200);

                expect(mongoose.Types.ObjectId.isValid(createdFeature._id)).toBe(true);
                expect(createdFeature).toMatchObject(newFeature);
                expect(new Date(createdFeature.createdAt).getTime()).toBeCloseTo(Date.now(), -2);
                expect(new Date(createdFeature.updatedAt).getTime()).toBeCloseTo(Date.now(), -2);
            });
        });

        describe('GET', () => {
            it('should return all features', async () => {
                const newFeature = { data: 'someData' };
                await request(app).post('/api/features').send(newFeature).expect(200);

                const { body: features } = await request(app).get('/api/features').expect(200);
                expect(features).toHaveLength(1);
                expect(mongoose.Types.ObjectId.isValid(features[0]._id)).toBe(true);
            });
        });
    });
});
