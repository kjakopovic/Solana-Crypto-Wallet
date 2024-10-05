import { ConnectionPool } from 'mssql';
import pool from '../config/database/Database';
import logger from '../config/Logger';

const className = 'NFTModel';

export interface bufferNFT{
    id: number;
    imageBuffer: Buffer;
    imageType: string;
}

class NFTModel{
    private db: ConnectionPool;

    constructor() {
        this.db = pool;
    }

    public async getWelcomeNFT(): Promise<bufferNFT | null> {
        logger.info('Getting the welcome NFT', { className });

        // Query to get the welcome NFT
        const sqlQuery = `
            SELECT id, imageBuffer, imageType
            FROM images
            WHERE id = 1;
            `;

        try {
            const result = await this.db.request().query(sqlQuery);
            logger.info('Welcome NFT retrieved successfully', { className });

            if (result.recordset.length === 0) {
                logger.error('No welcome NFT found', { className });
                return null;
            }

            return {
                id: result.recordset[0].id,
                imageBuffer: result.recordset[0].imageBuffer,
                imageType: result.recordset[0].imageType
            };

        } catch (err) {
            logger.error('Error retrieving welcome NFT', { error: err, className });
            throw err;
        }
    }

    public async saveNFTBuffer(imageBuffer: Buffer): Promise<void> {
        logger.info('Saving NFT buffer', { className });

        // Query to save the NFT buffer
        const sqlQuery = `
            INSERT INTO images (imageBuffer, imageType)
            VALUES (@imageBuffer, @imageType);
            `;

        try {
            await this.db.request()
                .input('imageBuffer', imageBuffer)
                .input('imageType', 'NFT')
                .query(sqlQuery);

            logger.info('NFT buffer saved successfully', { className });

        } catch (err) {
            logger.error('Error saving NFT buffer', { error: err, className });
            throw err;
        }
    }
}

export default new NFTModel();