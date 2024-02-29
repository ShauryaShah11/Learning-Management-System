import express from 'express';
import paymentController from '../controllers/payment.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/checkout', verifyToken, paymentController.checkout);
router.post('/paymentverification', verifyToken, paymentController.paymentVerification);

export default router;