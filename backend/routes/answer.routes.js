import express from 'express';
import answerController from '../controllers/answer.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/add/:questionId', verifyToken, answerController.addAnswer);
router.put('/update/:answerId', verifyToken, answerController.updateAnswer);
router.delete('/delete/:answerId', verifyToken, answerController.removeAnser);

export default router;