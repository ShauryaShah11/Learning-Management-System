import express from 'express';
import courseCategoryController from '../controllers/courseCategory.controller.js';

const router = express.Router();

router.post('/add-category', courseCategoryController.addCategory);
router.put('/update-category/:categoryId', courseCategoryController.updateCategory);
router.delete('/delete-category/:categoryId', courseCategoryController.removeCategory);
router.get('/get-category/:categoryId', courseCategoryController.getCourseByCategoryId);

export default router;