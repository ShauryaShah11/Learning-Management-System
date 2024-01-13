import mongoose from 'mongoose';

const courseCategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true, unique: true, maxlength: 50 },
  description: { type: String, maxlength: 500 },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseCategory' }, // Added for hierarchy
  coverImageUrl: { type: String }, // Example for metadata
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  courseCount: { type: Number, virtual: true }, // Virtual field for course count
  accessRestrictions: { type: String }, // Example for access control
});


// Adding indexing on categoryName for improved querying performance
courseCategorySchema.index({ categoryName: 1 });
courseCategorySchema.virtual('courseCount').get(function() {
  return this.courses.length;
});

const CourseCategory = mongoose.model('CourseCategory', courseCategorySchema);

export default CourseCategory;
