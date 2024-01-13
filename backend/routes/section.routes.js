import express from 'express';
import sectionController from '../controllers/section.controller.js';

const router = express.Router();

router.post('/add-section/:courseId', sectionController.addSection);
router.put('/update-section/:courseId', sectionController.updateSection);
router.delete('/remove-section/:courseId', sectionController.removeSection);
router.put('/update-subsection/:courseId', sectionController.updateSubSection);
router.delete('/remove-subsection/:courseId', sectionController.removeSubSection);

export default router;