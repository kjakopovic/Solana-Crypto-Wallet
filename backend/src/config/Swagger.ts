// src/config/Swagger.ts

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const options: swaggerJsdoc.Options = {
    definition:{
        openapi: '3.0.0',

        info:{
            title: 'Backend APIs for Solana Crypto Wallet',
            version: '1.0.0',
            description:
                'This is REST API documentation for the Solana Crypto Wallet backend',
        },

        components: {
            securitySchemes:{
                bearerAuth:{
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },

        security: [
            {
                bearerAuth: [],
            },
        ],

        servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
            },
        ],

    },

    apis: [
        './src/routes/*.ts', // Path to your route files
        './src/controllers/*.ts', // Path to your controller files
    ],
};

const swaggerSpecs = swaggerJsdoc(options);

function swaggerDocs(app: express.Express){
    // Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

    // Swagger JSON
    app.get('/api-docs.json', (req: express.Request, res: express.Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpecs);
    });
}

export default swaggerDocs;