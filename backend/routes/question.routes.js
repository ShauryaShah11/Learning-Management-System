import express from 'express';
import questionController from '../controllers/question.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/add/:courseId', verifyToken, questionController.addQuestion);
router.put('/update/:questionId', verifyToken, questionController.updateQuestion);
router.delete('/remove/:questionId', verifyToken, questionController.removeQuestion);
router.get('/:courseId', questionController.getQuestion);

export default router;