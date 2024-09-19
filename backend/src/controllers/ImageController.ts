// src/controllers/ImageController.ts

import { Request, Response } from 'express';
import ImageService from '../services/ImageService';
import logger from '../config/Logger';

const className = 'ImageController';

class ImageController {

    async getImages(req: Request, res: Response) {
        logger.info('Getting image by symbol', { className });

        const images = req.body.images as { symbol: string, url: string }[];

        logger.info('Images: ' + images, { className });

        try {
            const results = await Promise.all(images.map(async (image) => {
                const result = await ImageService.getImage(image.symbol, image.url);
                if (result && 'png' in result) {
                    return { symbol: image.symbol, png: result.png };
                } else {
                    return { symbol: image.symbol, png: null };
                }
            }));

            res.status(200).json(results);
        } catch (error) {
            logger.error('Error getting images by symbols: ' + error, { className });
            res.status(500).send(error);
        }
    }
}

export default new ImageController();