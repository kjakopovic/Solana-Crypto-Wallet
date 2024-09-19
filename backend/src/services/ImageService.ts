// src/services/ImageService.ts

import ImageModel from "../models/ImageModel";
import sharp from 'sharp';
import logger from '../config/Logger';
import axios from 'axios';

const className = 'ImageService';

class ImageService{

    private async convertSvgToPng (url: string) {
        logger.info('Converting SVG to PNG', { className });

        try {
            logger.info('Downloading SVG from URL: ' + url, { className });
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const svgBuffer = Buffer.from(response.data, 'binary');

            const pngBuffer = await sharp(svgBuffer)
                .png()
                .toBuffer();

            logger.info('SVG converted to PNG successfully', { className });
            return pngBuffer;

        } catch (error) {
            logger.error('Error converting SVG to PNG: ' + error, { className });
            throw error;
        }
    }

    private async saveImageToDatabase (symbol: string, url: string) {
        logger.info('Checking if the given symbol already has png assigned to it', { className });

        const existingImage = await ImageModel.findImageBySymbol(symbol);
        if(existingImage){
            logger.info('Image already exists in the database', { className });
            return Error('Image already exists in the database');
        }


        try {
            const pngBuffer = await this.convertSvgToPng(url);
            const pngBase64 = pngBuffer.toString('base64');
            const image = await ImageModel.saveImage(symbol, url, pngBase64);
            logger.info('Image saved to database successfully', { className });
            return image;

        } catch (error) {
            logger.error('Error saving image to database: ' + error, { className });
            throw error;
        }
    }

    async getImage(symbol: string, url: string) {
        logger.info('Getting image by symbol', { className });

        try {
            const image = await ImageModel.findImageBySymbol(symbol);
            if(!image){
                logger.info('Image not found', { className });
                logger.info('Fetching the image from the url', { className });
                const savedImage = await this.saveImageToDatabase(symbol, url);

                if(!savedImage){
                    return Error('Image not found and failed to save the image to the database');
                }

                return savedImage;
            }

            logger.info('Image found by symbol', { className });
            return image;

        } catch (error) {
            logger.error('Error getting image by symbol: ' + error, { className });
            throw error;
        }
    }

}

export default new ImageService();