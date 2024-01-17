import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { checkAccess } from '../middlewares/auth.middleware.js';
import courseCategoryController from '../controllers/courseCategory.controller.js';

const router = express.Router();

router.post('/add', verifyToken, checkAccess, courseCategoryController.addCategory);
router.put('/update/:categoryId', verifyToken, checkAccess, courseCategoryController.updateCategory);
router.delete('/delete/:categoryId', verifyToken, checkAccess, courseCategoryController.removeCategory);
router.get('/getCourses/:categoryId', courseCategoryController.getCourseByCategoryId);
router.get('/', courseCategoryController.getCategories);
router.get('/:categoryId', courseCategoryController.getCategoryById);

export default router;