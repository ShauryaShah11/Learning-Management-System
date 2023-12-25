import express from 'express';
import authController from '../controllers/authController.js';
import emailController from '../controllers/emailController.js';
import { checkIfUsernameExists, checkIfContactNumberExists, checkIfEmailExists } from '../middelwares/userValidationMiddleware.js';

const router = express.Router();
router.get('/login', authController.login);
router.post('/user-register', checkIfUsernameExists, checkIfEmailExists, checkIfContactNumberExists, authController.userRegister);
router.post('/tutor-register', checkIfUsernameExists, checkIfEmailExists, checkIfContactNumberExists, authController.tutorRegister);
router.get('/verification/:token', emailController.verifyEmail);

export default router;