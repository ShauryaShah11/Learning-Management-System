import express from 'express';
import answerController from '../controllers/answer.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/add-answer/:questionId', answerController.addAnswer);
router.put('/update-answer/:answerId', answerController.updateAnswer);
router.delete('/delete-answer/:answerId', answerController.removeAnser);

export default router;