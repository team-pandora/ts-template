import { StatusCodes } from 'http-status-codes';
import * as request from 'supertest';
import Server from '../src/express/server';

jest.setTimeout(30000);

describe('server tests', () => {
    let app: Express.Application;

    beforeAll(async () => {
        app = Server.createExpressApp();
    });

    test.todo('todo test'); // you can do todos for tests!

    describe('/isAlive', () => {
        it('should return alive', async () => {
            const { text } = await request(app).get('/isAlive').expect(StatusCodes.OK);
            expect(text).toBe('alive');
        });
    });

    describe('/unknownRoute', () => {
        it('should return status code 404', async () => {
            await request(app).get('/unknownRoute').expect(StatusCodes.NOT_FOUND);
        });
    });
});
