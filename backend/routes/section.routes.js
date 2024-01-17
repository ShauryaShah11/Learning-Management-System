import express from 'express';
import { uploadFiles } from '../middlewares/upload.middleware.js'
import sectionController from '../controllers/section.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/add/:courseId', verifyToken, uploadFiles, sectionController.addSection);
router.put('/update/:courseId', verifyToken, uploadFiles, sectionController.updateSection);
router.delete('/remove/:courseId', verifyToken, sectionController.removeSection);
router.put('/update-subsection/:courseId', verifyToken, sectionController.updateSubSection);
router.delete('/remove-subsection/:courseId', verifyToken, sectionController.removeSubSection);

export default router;