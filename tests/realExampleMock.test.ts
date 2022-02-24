/* eslint-disable no-underscore-dangle */
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import config from '../src/config';
import Server from '../src/express/server';

jest.setTimeout(30000);

const removeAllCollections = async () =>
    Promise.all(Object.values(mongoose.connection.collections).map((collection) => collection.deleteMany({})));

describe('example unit tests', () => {
    let app: Express.Application;

    beforeAll(async () => {
        await mongoose.connect(config.mongo.uri);
        await removeAllCollections();
        app = Server.createExpressApp();
    });

    afterEach(async () => {
        await removeAllCollections();
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    test.todo('todo test'); // you can do todos for tests!

    describe('/isAlive', () => {
        it('should return alive', async () => {
            const response = await request(app).get('/isAlive').expect(200);
            expect(response.text).toBe('alive');
        });
    });

    describe('/unknownRoute', () => {
        it('should return status code 404', () => {
            return request(app).get('/unknownRoute').expect(404);
        });
    });

    describe('/api/folders', () => {
        describe('POST', () => {
            it('should fail validation for unknown fields', () => {
                return request(app).post('/api/folders').send({ invalidField: 'some value' }).expect(400);
            });

            it('should fail because of missing fields ', async () => {
                return request(app).post('/api/folders').send({}).expect(400);
            });

            it('should create a folder', async () => {
                const newFolder = { name: 'someFolder' };
                const { body: createdFolder } = await request(app).post('/api/folders').send(newFolder).expect(200);

                expect(mongoose.Types.ObjectId.isValid(createdFolder._id)).toBe(true);
                expect(createdFolder).toMatchObject(newFolder);
                expect(new Date(createdFolder.createdAt).getTime()).toBeCloseTo(Date.now(), -2);
                expect(new Date(createdFolder.updatedAt).getTime()).toBeCloseTo(Date.now(), -2);
            });
        });

        describe('GET', () => {
            it('should return all folders', async () => {
                const newFolder = { name: 'someFolder' };
                await request(app).post('/api/folders').send(newFolder).expect(200);

                const { body: folders } = await request(app).get('/api/folders').expect(200);
                expect(folders).toHaveLength(1);
                expect(mongoose.Types.ObjectId.isValid(folders[0]._id)).toBe(true);
            });
        });
    });
});
