import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { checkAdminAccess } from '../middlewares/adminAccess.js';
import userController from '../controllers/user.controller.js';

const router = express.Router();
router.get('/', verifyToken, checkAdminAccess, userController.getUser);
router.get('/current', verifyToken, userController.getUserByAuthToken);
router.get('/:userId', verifyToken, checkAdminAccess, userController.getUserById);
router.delete('/:userId', verifyToken, checkAdminAccess, userController.removeUserById);
router.put('/:userId', verifyToken, checkAdminAccess, userController.updateUser);


export default router;