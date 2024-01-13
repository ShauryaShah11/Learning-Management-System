import express from "express";
import questionController from '../controllers/question.controller.js';

const router = express.Router();

router.post('/add-question', questionController.addQuestion);
router.delete('/remove-question/:questionId', questionController.removeQuestion);
router.delete('/get-question/:courseId', questionController.getQuestion);

export default router;