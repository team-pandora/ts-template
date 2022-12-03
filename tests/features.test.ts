import { createReadStream } from 'fs';
import { readFile } from 'fs/promises';
import { StatusCodes } from 'http-status-codes';
import { menash } from 'menashmq';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import config from '../src/config';
import Server from '../src/express/server';
import logger from '../src/utils/logger';
import minioClient from '../src/utils/minio/client';

jest.setTimeout(30000);

const removeFeatureCollection = async () =>
    mongoose.connection.collections[config.mongo.featuresCollectionName].deleteMany({});

const listMinioObjects = (bucketName: string) =>
    new Promise<string[]>((resolve, reject) => {
        const objects: string[] = [];
        const stream = minioClient.listObjects(bucketName, '', true);

        stream.on('data', (obj) => objects.push(obj.name));
        stream.on('error', reject);
        stream.on('end', () => resolve(objects));
    });

const deleteBucket = async (bucket: string) => {
    try {
        if (await minioClient.bucketExists(bucket)) {
            const objects = await listMinioObjects(bucket);
            if (objects.length) await minioClient.removeObjects(bucket, objects);
        }
    } catch (err) {
        logger.log('error', 'Failed to delete all minio objects.', err);
    }
};

describe('features tests', () => {
    let app: Express.Application;

    const minioBucket = 'test';
    const testFile = 'test.txt';

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
        await deleteBucket(minioBucket);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await menash.close();
    });

    describe('/api/features/mongo', () => {
        describe('POST', () => {
            it('should fail validation for unknown fields', async () => {
                await request(app)
                    .post('/api/features/mongo')
                    .send({ invalidField: 'some value' })
                    .expect(StatusCodes.BAD_REQUEST);
            });

            it('should fail because of missing fields', async () => {
                await request(app).post('/api/features/mongo').send({}).expect(StatusCodes.BAD_REQUEST);
            });

            it('should fail with duplicate key error', async () => {
                const newFeature = { data: 'someData' };
                await request(app).post('/api/features/mongo').send(newFeature).expect(StatusCodes.OK);
                await request(app).post('/api/features/mongo').send(newFeature).expect(StatusCodes.BAD_REQUEST);
            });

            it('should create a feature', async () => {
                const newFeature = { data: 'someData' };
                const { body: createdFeature } = await request(app)
                    .post('/api/features/mongo')
                    .send(newFeature)
                    .expect(StatusCodes.OK);

                expect(mongoose.Types.ObjectId.isValid(createdFeature._id)).toBe(true);
                expect(createdFeature).toMatchObject(newFeature);
                expect(new Date(createdFeature.createdAt).getTime()).toBeCloseTo(Date.now(), -2);
                expect(new Date(createdFeature.updatedAt).getTime()).toBeCloseTo(Date.now(), -2);
            });
        });

        describe('GET', () => {
            it('should return all features', async () => {
                const newFeature = { data: 'someData' };
                await request(app).post('/api/features/mongo').send(newFeature).expect(StatusCodes.OK);

                const { body: features } = await request(app).get('/api/features/mongo').expect(StatusCodes.OK);
                expect(features).toHaveLength(1);
                expect(mongoose.Types.ObjectId.isValid(features[0]._id)).toBe(true);
            });
        });
    });

    describe('/api/features/rabbit', () => {
        describe('POST', () => {
            it('should fail validation for unknown fields', async () => {
                await request(app)
                    .post('/api/features/rabbit')
                    .send({ invalidField: 'some value' })
                    .expect(StatusCodes.BAD_REQUEST);
            });

            it('should fail because of missing fields', async () => {
                await request(app).post('/api/features/rabbit').send({}).expect(StatusCodes.BAD_REQUEST);
            });

            it('should send a rabbit message', async () => {
                const { text } = await request(app)
                    .post('/api/features/rabbit')
                    .send({ message: 'message' })
                    .expect(StatusCodes.OK);
                expect(text).toBe('Message sent');
            });
        });
    });

    describe('/api/features/minio/buckets/:bucketName/objects/:objectName', () => {
        describe('POST', () => {
            it('should fail because no file was provided', async () => {
                await request(app)
                    .post(`/api/features/minio/buckets/${minioBucket}/objects/${testFile}`)
                    .set('Content-Type', 'multipart/form-data')
                    .field('someField', 'text')
                    .expect(StatusCodes.BAD_REQUEST);
            });

            it('should fail because of invalid content type', async () => {
                await request(app)
                    .post(`/api/features/minio/buckets/${minioBucket}/objects/${testFile}`)
                    .set('Content-Type', 'text/plain')
                    .expect(StatusCodes.BAD_REQUEST);
            });

            it('should upload a file', async () => {
                await request(app)
                    .post(`/api/features/minio/buckets/${minioBucket}/objects/${testFile}`)
                    .set('Content-Type', 'multipart/form-data')
                    .field('file', createReadStream(`./tests/${testFile}`))
                    .expect(StatusCodes.OK);
            });
        });

        describe('GET', () => {
            it('should fail validation for unknown fields', async () => {
                await request(app)
                    .get(`/api/features/minio/buckets/${minioBucket}/objects/${testFile}`)
                    .send({ invalidField: 'some value' })
                    .expect(StatusCodes.BAD_REQUEST);
            });

            it('should get a file', async () => {
                await request(app)
                    .post(`/api/features/minio/buckets/${minioBucket}/objects/${testFile}`)
                    .set('Content-Type', 'multipart/form-data')
                    .field('file', createReadStream(`./tests/${testFile}`))
                    .expect(StatusCodes.OK);

                const { text } = await request(app)
                    .get(`/api/features/minio/buckets/${minioBucket}/objects/${testFile}`)
                    .expect(StatusCodes.OK);

                expect(text).toBe(await readFile(`./tests/${testFile}`, 'utf8'));
            });
        });

        describe('DELETE', () => {
            it('should fail validation for unknown fields', async () => {
                await request(app)
                    .delete(`/api/features/minio/buckets/${minioBucket}/objects/${testFile}`)
                    .send({ invalidField: 'some value' })
                    .expect(StatusCodes.BAD_REQUEST);
            });

            it('should delete a file', async () => {
                await request(app)
                    .post(`/api/features/minio/buckets/${minioBucket}/objects/${testFile}`)
                    .set('Content-Type', 'multipart/form-data')
                    .field('file', createReadStream(`./tests/${testFile}`))
                    .expect(StatusCodes.OK);

                await request(app)
                    .delete(`/api/features/minio/buckets/${minioBucket}/objects/${testFile}`)
                    .expect(StatusCodes.OK);

                await request(app)
                    .get(`/api/features/minio/buckets/${minioBucket}/objects/${testFile}`)
                    .expect(StatusCodes.NOT_FOUND);
            });
        });
    });
});
