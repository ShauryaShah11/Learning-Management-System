import mongoose from 'mongoose';
import Payment from '../../models/Payment.model.js';

describe('Payment Model', () => {
    // Connect to MongoDB before running tests
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
    });

    // Clear the database after each test
    afterEach(async () => {
        await Payment.deleteMany({});
    });

    // Disconnect from MongoDB after all tests are done
    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('Payment Creation', () => {
        it('should create a new payment', async () => {
            // Sample data for creating a new payment
            const paymentData = {
                razorpay_order_id: 'order123',
                razorpay_payment_id: 'payment123',
                razorpay_signature: 'signature123',
                user: mongoose.Types.ObjectId(), // Replace with a valid user ID
                course: mongoose.Types.ObjectId(), // Replace with a valid course ID
                paymentStatus: 'completed',
            };

            const payment = await Payment.create(paymentData);
            expect(payment).toBeDefined();
            expect(payment.razorpay_order_id).toBe(paymentData.razorpay_order_id);
            expect(payment.razorpay_payment_id).toBe(paymentData.razorpay_payment_id);
            expect(payment.razorpay_signature).toBe(paymentData.razorpay_signature);
            expect(payment.user).toEqual(paymentData.user);
            expect(payment.course).toEqual(paymentData.course);
            expect(payment.paymentStatus).toBe(paymentData.paymentStatus);
        });

        it('should require all required fields', async () => {
            try {
                await Payment.create({});
            } catch (error) {
                expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
                expect(error.errors.razorpay_order_id).toBeDefined();
                expect(error.errors.razorpay_payment_id).toBeDefined();
                expect(error.errors.razorpay_signature).toBeDefined();
                expect(error.errors.user).toBeDefined();
                expect(error.errors.course).toBeDefined();
                expect(error.errors.paymentStatus).toBeDefined();
            }
        });

        // Add more test cases as needed to cover other functionalities of the Payment model
    });
});
