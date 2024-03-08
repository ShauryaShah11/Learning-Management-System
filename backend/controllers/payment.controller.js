import crypto from "crypto";
import { instance } from "../config/razorpay.js";
import Course from "../models/Course.model.js";
import Payment from "../models/Payment.model.js";

const paymentController = {
    checkout: async (req, res) => {
        try {
            const options = {
                amount: Number(req.body.amount * 100),
                currency: "INR",
            };
            const order = await instance.orders.create(options);
            res.status(200).json({
                success: true,
                order,
            });
        } catch (error) {
            res.status(500).json({ error: "Error creating order" });
        }
    },

    paymentVerification: async (req, res) => {
        try {
            const {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            } = req.body;

            const courseId = req.body.courseId;
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    error: "Course not found",
                });
            }

            const body = razorpay_order_id + "|" + razorpay_payment_id;

            const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
                .update(body.toString())
                .digest("hex");

            const isAuthentic = expectedSignature === razorpay_signature;
            if (isAuthentic) {
                const payment = await Payment.create({
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                    user: req.user._id,
                    course: courseId,
                    paymentStatus: "completed",
                });

                res.json({
                    success: true,
                    paymentId: payment._id,
                    message: "Payment transaction created successfully",
                });
            } else {
                res.status(500).json({
                    success: false,
                });
            }
        } catch (error) {
            res.status(500).json({ error: "Error verifying payment" });
        }
    },
};

export default paymentController;
