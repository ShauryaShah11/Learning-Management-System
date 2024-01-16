import express from 'express';
import reviewController from '../controllers/review.controller.js';

const router = express.Router();
router.post('/add/:courseId', reviewController.addReview);
router.put('/update/:reviewId', reviewController.updateReview);
router.delete('/delete/:reviewId', reviewController.deleteReview);

export default router;