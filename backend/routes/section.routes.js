import express from 'express';
import { uploadFiles } from '../middlewares/upload.js'
import sectionController from '../controllers/section.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/add/:courseId', verifyToken, upload.single('file'), sectionController.addSection);
router.put('/update/:courseId', verifyToken, sectionController.updateSection);
router.delete('/remove/:courseId', verifyToken, sectionController.removeSection);
router.post('/add/:sectionId', verifyToken, upload.single('file'), sectionController.addSubSection);
router.put('/update-subsection/:courseId', verifyToken, upload.single('file'), sectionController.updateSubSection);
router.delete('/remove-subsection/:courseId', verifyToken, sectionController.removeSubSection);

export default router;