import express from 'express';
import courseController from '../controllers/course.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { uploadFiles } from '../middlewares/upload.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/add', verifyToken, upload.single('file'), uploadFiles, courseController.createCourse);
router.get('/', courseController.getCourse);
router.get('/tutor/:tutorId', courseController.getCourseByTutorId)
router.get('/:courseId', courseController.getCourseById);
router.put('/update/:courseId', verifyToken, courseController.updateCourse);
router.delete('/delete/:courseId', verifyToken, courseController.deleteCourse);

export default router;