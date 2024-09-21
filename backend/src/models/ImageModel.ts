// src/models/ImageModel.ts

import { ConnectionPool } from 'mssql';
import pool from '../config/database/Database';
import logger from '../config/Logger';
import {UserModel} from "./UserModel";

const className = 'UserModel';

interface Image{
    id: string;
    url: string;
    png: string;
}

export class ImageModel{

    private db: ConnectionPool;

    constructor() {
        this.db = pool;
    }

    async findImageBySymbol(symbol: string): Promise<Image | null> {
        logger.info('Finding image by symbol', { className });
        const sqlQuery = `
            SELECT * FROM images WHERE symbol = @symbol;
        `;

        try {
            const result = await this.db.request()
                .input('symbol', symbol)
                .query(sqlQuery);

            if (result.recordset.length === 0) {
                return null;
            }

            logger.info('Image found by symbol', { className });
            return result.recordset[0];
        } catch (err) {
            logger.error('Error finding image by symbol', { error: err, className });
            throw err;
        }
    }

    async saveImage(symbol: string, url: string, png: string): Promise<void> {
        logger.info('Saving image', { className });
        const sqlQuery = `
            INSERT INTO images (symbol, url, png)
            VALUES (@symbol, @url, @png);
        `;

        try {
            await this.db.request()
                .input('symbol', symbol)
                .input('url', url)
                .input('png', png)
                .query(sqlQuery);

            logger.info('Image saved successfully', { className });
            console.log(`Image ${symbol} saved successfully.`);
        } catch (err) {
            logger.error('Error saving image', { error: err, className });
            throw err;
        }
    }

}

export default new ImageModel();