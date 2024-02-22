import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { checkAdminAccess } from '../middlewares/adminAccess.js';
import courseCategoryController from '../controllers/courseCategory.controller.js';
import { upload } from '../middlewares/multer.js';
import { uploadFiles } from '../middlewares/upload.js';

const router = express.Router();

router.post('/add', verifyToken, checkAdminAccess, upload.single('file'), uploadFiles, courseCategoryController.addCategory);
router.put('/update/:categoryId', verifyToken, checkAdminAccess, courseCategoryController.updateCategory);
router.delete('/delete/:categoryId', verifyToken, checkAdminAccess, courseCategoryController.removeCategory);
router.get('/getCourses/:categoryId', courseCategoryController.getCourseByCategoryId);
router.get('/', courseCategoryController.getCategories);
router.get('/:categoryId', courseCategoryController.getCategoryById);

export default router;