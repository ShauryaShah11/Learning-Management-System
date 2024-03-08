import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import tutorController from "../controllers/tutor.controller.js";

const router = express.Router();
router.get("/", tutorController.getTutor);
router.get("/:tutorId", tutorController.getTutorById);
router.put('/:tutorId', verifyToken, tutorController.updateTutor);

export default router;
