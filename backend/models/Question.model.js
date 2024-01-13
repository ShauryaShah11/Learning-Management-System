import mongoose from 'mongoose';

// Question Schema
const questionSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Reference to the Course
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User who asked the question
  questionText: { type: String, required: true }, // Text of the question
  datePosted: { type: Date, default: Date.now }, // Date when the question was posted
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }] // Array of Answer references
});

questionSchema.index({ course: 1 });

const Question = mongoose.model('Question', questionSchema);

export default Question;
