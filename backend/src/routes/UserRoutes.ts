// src/routes/UserRoutes.ts

import { Router } from 'express';
import UserController from "../controllers/UserController";

const router = Router();

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user by providing the public key and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               publicKey:
 *                 type: string
 *                 required: true
 *               password:
 *                 type: string
 *                 required: true
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      message:
 *                          type: User created successfully
 *                      refreshToken:
 *                          type: string
 *                      accessToken:
 *                          type: string
 *       400:
 *         description: Invalid input
 *       500:
 *          description: Error creating user
 */
router.post('/register', UserController.createUser);

/**
 * @swagger
 * /user/update:
 *   put:
 *     summary: Update user information
 *     description: Update user's information by providing the public key and the new information
 *     parameters:
 *       - in: path
 *         name: publicKey
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 required: false
 *               newPassword:
 *                 type: string
 *                 required: false
 *     responses:
 *       200:
 *          description: User updated successfully
 *       400:
 *          description: Public key is required
 *       500:
 *          description: Error updating user
 */
router.put('/update', UserController.updateUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     description: Login a user by providing the public key and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               publicKey:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *          description: User logged in successfully
 *       400:
 *          description: Invalid input
 *       401:
 *          description: Invalid password
 *       404:
 *          description: User not found
 *       500:
 *          description: Error logging in user
 */
router.post('/login', UserController.loginUser);

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout a user
 *     description: Logout a user by providing the public key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               publicKey:
 *                 type: string
 *     responses:
 *       200:
 *          description: User logged out successfully
 *       400:
 *          description: Public key is required
 *       500:
 *          description: Error logging out user
 */
router.post('/logout', UserController.logoutUser);

/**
 * @swagger
 * /user/info:
 *   get:
 *     summary: Get user information
 *     description: Get user information by providing the public key in the path
 *     parameters:
 *       - in: path
 *         name: publicKey
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *       400:
 *         description: Public key is required
 *       500:
 *         description: Error getting user information
 */
router.get('/info', UserController.getUserInformation);

export default router;