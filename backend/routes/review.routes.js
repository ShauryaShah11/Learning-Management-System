import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import reviewController from '../controllers/review.controller.js';

const router = express.Router();
router.post('/add/:courseId', verifyToken, reviewController.addReview);
router.put('/update/:reviewId', verifyToken, reviewController.updateReview);
router.delete('/delete/:reviewId', verifyToken, reviewController.deleteReview);
router.get('/:courseId', reviewController.getReviews);

export default router;