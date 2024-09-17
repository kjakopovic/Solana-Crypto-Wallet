// src/routes/UserRoutes.ts

import { Router } from 'express';
import {
    createUserController,
    getUserByIdController,
    getUserByUsernameController,
    loginUserController,
    updateUserController
} from '../controllers/UserController';

const router = Router();

router.post('/create', createUserController);
router.get('/username/:username', getUserByUsernameController);
router.get('/id/:id', getUserByIdController);
router.put('/update/:id', updateUserController);
router.post('/login', loginUserController);

export default router;