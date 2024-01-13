import express from 'express';
import courseController from '../controllers/course.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/add-course', verifyToken, courseController.createCourse);
router.get('/', courseController.getCourse);
router.get('/:courseId', courseController.getCourseById);
router.put('/update-course/:courseId', courseController.updateCourse);
router.delete('/delete-course/:courseId', courseController.deleteCourse);

export default router;