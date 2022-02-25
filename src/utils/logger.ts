import * as winston from 'winston';

const formatter = (info: winston.Logform.TransformableInfo): string => {
    if (info.express) {
        return (
            `${info.timestamp} | ` +
            `[${info.level.toUpperCase()}] ` +
            `${info.method} ` +
            `${info.url} ` +
            `(${info.duration}) ` +
            `[${info.status}] ` +
            `${info.message}`
        );
    }

    return `${info.timestamp} | [${info.level.toUpperCase()}] ${info.message}`;
};

const logger = winston.createLogger({
    level: 'info',
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.uncolorize(),
        winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss.SSS' }),
        winston.format.printf(formatter),
    ),
    defaultMeta: { service: 'ts-template' },
    exitOnError: false,
    levels: { error: 0, warn: 1, info: 2 },
});

export default logger;
export { logger };
