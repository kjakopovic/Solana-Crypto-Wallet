// src/routes/UserRoutes.ts

import { Router } from 'express';
import {
    createUserController,
    getUserByIdController,
    getUserByUsernameController
} from '../controllers/UserController';

const router = Router();

router.post('/create', createUserController);
router.get('/username/:username', getUserByUsernameController);
router.get('/id/:id', getUserByIdController);

export default router;