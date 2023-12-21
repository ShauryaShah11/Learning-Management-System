import mongoose from 'mongoose';

const tutorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', index: true },
  yearOfExperience: { type: Number, validate: { validator: isPositiveNumber } },
  coursesTeaching: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  bio: { type: String, maxlength: 500 }, // Example validation
  expertise: { type: String }, // Changed to String
  achievements: { type: String }, // Changed to String
  ratings: { type: Number, default: 0 }, // Store individual reviews for calculation
  averageRating: { type: Number, virtual: true }, // Virtual field for average rating
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: { type: Date, default: Date.now },
});

tutorSchema.virtual('averageRating').get(function() {
  // Calculate average rating based on stored reviews
});

const Tutor = mongoose.model('Tutor', tutorSchema);

module.exports = Tutor;
