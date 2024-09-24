// src/routes/UserRoutes.ts

import { Router } from 'express';
import UserController from "../controllers/UserController";

const router = Router();

/**
 * @swagger
 * /user/register:
 *  post:
 *      summary: Register a new user
 *      requestBody:
 *          required: true
 *          content:
 *          application/json:
 *              schema:
 *              type: object
 *              properties:
 *              password:
 *              type: string
 *              publicKey:
 *              type: string
 *      responses:
 *          201:
 *              description: User created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                          refreshToken:
 *                              type: string
 *                          accessToken:
 *                              type: string
 *          500:
 *              description: Error creating user
 *          400:
 *              description: Error creating user
 */
router.post('/register', UserController.createUser);

/**
 * @swagger
 * /user/update:
 * put:
 *     summary: Update user information
 *     requestBody:
 *     required: true
 *     content:
 *     application/json:
 *     schema:
 *     type: object
 *     properties:
 *     publicKey:
 *     type: string
 *     updates:
 *     type: object
 *     properties:
 *     password:
 *     type: string
 *     responses:
 *     200:
 *     description: User updated successfully
 *     500:
 *     description: Error updating user
 *     400:
 *     description: Error updating user
 */

router.put('/update', UserController.updateUser);
router.post('/login', UserController.loginUser);
router.post('/logout', UserController.logoutUser);
router.get('/info', UserController.getUserInformation);

export default router;