import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { checkAdminAccess } from '../middlewares/adminAccess.js';
import courseCategoryController from '../controllers/courseCategory.controller.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/add', verifyToken, checkAdminAccess, upload.single('file'), courseCategoryController.addCategory);
router.put('/:categoryId', verifyToken, checkAdminAccess, upload.single('file'), courseCategoryController.updateCategory);
router.delete('/:categoryId', verifyToken, checkAdminAccess, courseCategoryController.removeCategory);
router.get('/getCourses/:categoryId', courseCategoryController.getCourseByCategoryId);
router.get('/', courseCategoryController.getCategories);
router.get('/:categoryId', courseCategoryController.getCategoryById);

export default router;