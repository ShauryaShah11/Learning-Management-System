import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import courseEnrolledController from '../controllers/courseEnrolled.controller.js';

const router = express.Router();

router.post('/:courseId', verifyToken, courseEnrolledController.enrollInCourse);
router.get('/user/:courseId', verifyToken, courseEnrolledController.getEnrolledUsers);
router.put('/unenroll/:courseId', verifyToken, courseEnrolledController.unEnrollUser);


export default router;