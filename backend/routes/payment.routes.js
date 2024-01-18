import express from 'express';
import paymentController from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/checkout', paymentController.checkout);
router.post('/paymentverification', paymentController.paymentVerification);

export default router;