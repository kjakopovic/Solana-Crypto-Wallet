// src/config/Logger.ts

import { createLogger, format, transports } from 'winston';

const customFormat = format.printf(({ timestamp, level, message, className }) => {
    return `${timestamp} ${level} [${className}]: ${message}`;
});

const logger = createLogger({
    level: 'debug',
    format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format((info) => {
            info.className = info.className || 'UnknownClass';
            return info;
        })(),
        customFormat
    ),
    transports: [
        new transports.Console({ level: 'info' }),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log', level: 'info' }),
    ],
});

export default logger;