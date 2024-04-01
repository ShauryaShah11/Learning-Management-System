import crypto from "crypto";
import paymentController from "../../controllers/payment.controller.js";
import Course from "../../models/Course.model.js";
import Payment from "../../models/Payment.model.js";

jest.mock("crypto");
jest.mock("../../models/Course.model.js");
jest.mock("../../models/Payment.model.js");

describe("paymentController", () => {
    describe("checkout", () => {
        it("should successfully create an order", async () => {
            const req = {
                body: {
                    amount: 1000,
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const options = {
                amount: 100000,
                currency: "INR",
            };
            const order = {
                id: "order_id",
            };
            paymentController.instance.orders.create.mockResolvedValueOnce(order);

            await paymentController.checkout(req, res);

            expect(paymentController.instance.orders.create).toHaveBeenCalledTimes(1);
            expect(paymentController.instance.orders.create).toHaveBeenCalledWith(options);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                order,
            });
        });

        // Add more test cases for other scenarios
    });

    describe("paymentVerification", () => {
        it("should successfully verify payment and create transaction", async () => {
            const req = {
                body: {
                    razorpay_order_id: "order_id",
                    razorpay_payment_id: "payment_id",
                    razorpay_signature: "valid_signature",
                    courseId: "course_id",
                    user: {
                        _id: "user_id",
                    },
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const course = {
                _id: "course_id",
            };
            const payment = {
                _id: "payment_id",
            };
            Course.findById.mockResolvedValueOnce(course);
            crypto.createHmac.mockReturnValueOnce({
                update: jest.fn().mockReturnThis(),
                digest: jest.fn().mockReturnValueOnce("valid_signature"),
            });
            Payment.create.mockResolvedValueOnce(payment);

            await paymentController.paymentVerification(req, res);

            expect(Course.findById).toHaveBeenCalledTimes(1);
            expect(Course.findById).toHaveBeenCalledWith("course_id");
            expect(crypto.createHmac).toHaveBeenCalledTimes(1);
            expect(crypto.createHmac).toHaveBeenCalledWith("sha256", process.env.RAZORPAY_APT_SECRET);
            expect(Payment.create).toHaveBeenCalledTimes(1);
            expect(Payment.create).toHaveBeenCalledWith({
                razorpay_order_id: "order_id",
                razorpay_payment_id: "payment_id",
                razorpay_signature: "valid_signature",
                user: "user_id",
                course: "course_id",
                paymentStatus: "completed",
            });
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                paymentId: "payment_id",
                message: "Payment transaction created successfully",
            });
        });

        // Add more test cases for other scenarios
    });
});
