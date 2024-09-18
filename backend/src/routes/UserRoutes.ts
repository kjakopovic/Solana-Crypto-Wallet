// src/routes/UserRoutes.ts

import { Router } from 'express';
import UserController from "../controllers/UserController";

const router = Router();

router.post('/register', UserController.createUser);
router.put('/update', UserController.updateUser);
router.post('/login', UserController.loginUser);
router.post('/logout', UserController.logoutUser);

export default router;