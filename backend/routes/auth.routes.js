import express from 'express';
import authController from '../controllers/auth.controller.js';
import emailController from '../controllers/email.controller.js';
import { checkIfUsernameExists, checkIfContactNumberExists, checkIfEmailExists } from '../middlewares/userValidation.js';

const router = express.Router();
router.post('/login', authController.login);
router.post('/user-register', checkIfUsernameExists, checkIfEmailExists, checkIfContactNumberExists, authController.userRegister);
router.post('/tutor-register', checkIfUsernameExists, checkIfEmailExists, checkIfContactNumberExists, authController.tutorRegister);
router.get('/verification/:token', emailController.verifyEmail);

export default router;