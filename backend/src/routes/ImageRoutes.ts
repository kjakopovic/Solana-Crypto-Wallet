// src/routes/ImageRoutes.ts

import express from 'express';
import ImageController from '../controllers/ImageController';

const router = express.Router();

router.get('/get', ImageController.getImage);

export default router;