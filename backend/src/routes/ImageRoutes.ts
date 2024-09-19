// src/routes/ImageRoutes.ts

import express from 'express';
import ImageController from '../controllers/ImageController';

const router = express.Router();

router.post('/get', ImageController.getImages);

export default router;