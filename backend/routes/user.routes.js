import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { checkAccess } from '../middlewares/auth.middleware.js';
import userController from '../controllers/user.controller.js';

const router = express.Router();
router.get('/users', verifyToken, checkAccess, userController.getUser);

export default router;