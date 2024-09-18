// src/routes/UserRoutes.ts

import { Router } from 'express';
import {
    createUserController,
    getUserByIdController,
    getUserByPublicKeyController,
    loginUserController,
    logoutUserController,
    updateUserController
} from '../controllers/UserController';

const router = Router();

router.post('/create', createUserController);
router.get('/publickey/:publicKey', getUserByPublicKeyController);
router.get('/id/:id', getUserByIdController);
router.put('/update/:id', updateUserController);
router.post('/login', loginUserController);
router.post('/logout', logoutUserController);

export default router;