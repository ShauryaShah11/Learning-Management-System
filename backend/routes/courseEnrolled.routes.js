import express from 'express';
import courseEnrolledController from '../controllers/courseEnrolled.controller.js';

const router = express.Router();

router.post('/:courseId', courseEnrolledController.enrollInCourse);
router.get('/user/:courseId', courseEnrolledController.getEnrolledUsers);
router.put('/unenroll/:courseId', courseEnrolledController.unEnrollUser);


export default router;