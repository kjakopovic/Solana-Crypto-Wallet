"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const customFormat = winston_1.format.printf(({ timestamp, level, message, className }) => {
    return `${timestamp} ${level} [${className}]: ${message}`;
});
const logger = (0, winston_1.createLogger)({
    level: 'debug',
    format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), (0, winston_1.format)((info) => {
        info.className = info.className || 'UnknownClass';
        return info;
    })(), customFormat),
    transports: [
        new winston_1.transports.Console({ level: 'info' }),
        new winston_1.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.transports.File({ filename: 'logs/combined.log', level: 'info' }),
    ],
});
exports.default = logger;
