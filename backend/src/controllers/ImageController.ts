// src/controllers/ImageController.ts

import { Request, Response } from 'express';
import ImageService from '../services/ImageService';
import logger from '../config/Logger';

const className = 'ImageController';

class ImageController {

    async getImage(req: Request, res: Response) {
        logger.info('Getting image by symbol', { className });

        const symbol = req.body.symbol as string;
        const url = req.body.url as string;

        logger.info('Symbol: ' + symbol, { className });
        logger.info('URL: ' + url, { className });

        try {
            const image = await ImageService.getImage(symbol, url);
            if (image && 'png' in image) {
                const imageBuffer = Buffer.from(image.png, 'base64');
                res.setHeader('Content-Type', 'image/png');
                res.status(200).send(imageBuffer);
            } else {
                res.status(404).send('Image not found');
            }

        } catch (error) {
            logger.error('Error getting image by symbol: ' + error, { className });
            res.status(500).send(error);
        }
    }
}

export default new ImageController();