import { hostname } from 'os';
import * as winston from 'winston';
import config from '../config';

const formatter = (info: winston.Logform.TransformableInfo): string => {
    if (info.express) {
        return (
            `${info.timestamp} | ` +
            `[${info.level.toUpperCase()}] ` +
            `${info.method} ` +
            `${info.originalUrl} ` +
            `(${info.duration}) ` +
            `[${info.status}] ` +
            `${info.message}`
        );
    }

    return `${info.timestamp} | [${info.level.toUpperCase()}] ${info.message}`;
};

const elkIgnoreKeys = ['express'];

const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.uncolorize(),
                winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss.SSS' }),
                winston.format.printf(formatter),
            ),
        }),
        new winston.transports.File({
            filename: `${hostname()}.log`,
            dirname: config.service.logsDir,
            format: winston.format.combine(
                winston.format((info) => (info.express ? info : false))(),
                winston.format.json({ replacer: (key, value) => (elkIgnoreKeys.includes(key) ? undefined : value) }),
            ),
        }),
    ],
    exitOnError: false,
    levels: { error: 0, warn: 1, info: 2 },
});

export default logger;
