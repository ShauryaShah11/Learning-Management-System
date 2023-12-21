import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Reference to the Course model
  amount: { type: Number, required: true }, // Amount paid for the course
  paymentDate: { type: Date, default: Date.now }, // Date of the payment
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
