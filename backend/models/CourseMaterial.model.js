import mongoose from 'mongoose';

const courseMaterialSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true }]
 // Multiple parent titles containing subsections
});
courseMaterialSchema.index({ course: 1 });

const CourseMaterial = mongoose.model('CourseMaterial', courseMaterialSchema);

export default CourseMaterial;
