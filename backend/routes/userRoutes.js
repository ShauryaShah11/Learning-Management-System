import express from 'express';
import { verifyToken } from '../middelwares/verifyToken.js';
import { checkAccess } from '../middelwares/authMiddleware.js';
import userController from '../controllers/userController.js';

const router = express.Router();
router.get('/users', verifyToken, checkAccess, userController.getUser);

export default router;