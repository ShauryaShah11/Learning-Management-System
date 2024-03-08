import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        razorpay_order_id: {
            type: String,
            required: true,
        },
        razorpay_payment_id: {
            type: String,
            required: true,
        },
        razorpay_signature: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }, // Reference to the User model
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        }, // Reference to the Course model
        paymentStatus: {
            type: String,
            enum: ["completed", "pending", "failed"],
            required: true, // Consider whether you want this to be required
        },
    },
    { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
