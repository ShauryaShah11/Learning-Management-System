import express from 'express';
import sectionController from '../controllers/section.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/add/:courseId', verifyToken, upload.single('file'), sectionController.addSection);
router.put('/update/:sectionId', verifyToken, sectionController.updateSection);
router.delete('/remove/:courseId', verifyToken, sectionController.removeSection);
router.post('/subsection/add/:sectionId', verifyToken, upload.single('file'), sectionController.addSubSection);
router.put('/subsection/update/:subsectionId', verifyToken, upload.single('file'), sectionController.updateSubSection);
router.delete('/subsection/remove/:courseId', verifyToken, sectionController.removeSubSection);
router.get('/course/:courseId', sectionController.getSection);
router.get('/:sectionId', sectionController.getSectionById);
router.get('/subsection/:subsectionId', sectionController.getSubSectionById);
router.get('/:sectionId/subsections', sectionController.getSubSection);

export default router;