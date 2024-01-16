import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  price: { type: Number, required: true, min: 0 }, // Ensuring non-negative price
  duration: { type: String, required: true },
  description: { type: String, required: true },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  prerequisites: [{ type: String }], // Array of strings to store prerequisites
  language: { type: String, required: true },
  thumbnailUrl: { type: String, validate: /^https?:\/\// }, // Basic URL format validation
  published: { type: Boolean, default: false },
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: { type: Date, default: Date.now },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true }, // Making tutor required
  studentsEnrolled: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseCategory', required: true },
});

courseSchema.index({ courseName: 1, tutor: 1, category: 1, published: 1, level: 1 });
const Course = mongoose.model('Course', courseSchema);

export default Course;
