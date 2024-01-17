import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { checkAccess } from '../middlewares/auth.middleware.js';
import userController from '../controllers/user.controller.js';

const router = express.Router();
router.get('/', verifyToken, checkAccess, userController.getUser);
router.get('/:userId', verifyToken, checkAccess, userController.getUserById);
router.delete('/:userId', verifyToken, checkAccess, userController.removeUserById);
router.put('/:userId', verifyToken, checkAccess, userController.updateUser);


export default router;