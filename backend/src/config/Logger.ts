// src/config/Logger.ts

import { createLogger, format, transports } from 'winston';

const customFormat = format.printf(({ timestamp, level, message, className }) => {
    return `${timestamp} ${level} [${className}]: ${message}`;
});

const logger = createLogger({
    level: 'debug',
    format: format.combine(
        format.timestamp(),
        format((info) => {
            info.className = info.className || 'UnknownClass';
            return info;
        })(),
        customFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'combined.log' })
    ],
});

export default logger;