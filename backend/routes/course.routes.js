import express from 'express';
import courseController from '../controllers/course.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { uploadFiles } from '../middlewares/upload.js';
import { upload } from '../middlewares/multer.js';
import { checkAdminAccess } from '../middlewares/adminAccess.js';

const router = express.Router();

router.post('/add', verifyToken, upload.single('file'), courseController.createCourse);
router.get('/', courseController.getCourse);
router.get('/all', verifyToken, checkAdminAccess, courseController.getAllCourse);
router.get('/tutor/:tutorId', courseController.getCourseByTutorId);
router.get('/search', courseController.getSearchCourse);
router.get('/:courseId', courseController.getCourseById);
router.post('/toggle/:courseId', verifyToken, checkAdminAccess, courseController.toggleCourse);
router.put('/:courseId', verifyToken, upload.single('file'), courseController.updateCourse);
router.delete('/:courseId', verifyToken, courseController.deleteCourse);
router.get('/:courseId/content', courseController.getCourseContent);

export default router;