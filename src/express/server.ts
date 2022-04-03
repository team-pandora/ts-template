import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { once } from 'events';
import * as express from 'express';
import helmet from 'helmet';
import * as http from 'http';
import config from '../config';
import { errorMiddleware } from './error';
import { loggerMiddleware, setStartTime } from './logger';
import appRouter from './router';

class Server {
    private app: express.Application;

    private http: http.Server;

    private port: number;

    constructor(port: number) {
        this.app = Server.createExpressApp();
        this.port = port;
    }

    static createExpressApp() {
        const app = express();

        app.use(setStartTime);

        if (config.service.useCors) {
            app.use(cors());
        }

        app.use(helmet());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser());

        app.use(appRouter);

        app.use(errorMiddleware);

        app.use(loggerMiddleware);

        return app;
    }

    async start() {
        this.http = this.app.listen(this.port);
        await once(this.http, 'listening');
    }
}

export default Server;
