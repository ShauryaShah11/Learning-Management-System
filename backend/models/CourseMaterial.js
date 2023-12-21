import mongoose from "mongoose";

const subsectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, // e.g., video, pdf, quiz, article
  url: { type: String, required: true }, // URL or CMS reference
  fileSize: { type: Number }, // Optional for specific types
  duration: { type: Number }, // Optional for videos
  order: { type: Number, default: 0 }, // Resource order
  completedByStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
});
const parentTitleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subsections: [subsectionSchema],
});

const courseMaterialSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  parentTitles: [parentTitleSchema], // Multiple parent titles containing subsections
});
courseMaterialSchema.index({ course: 1 });

const CourseMaterial = mongoose.model('CourseMaterial', courseMaterialSchema);

export default CourseMaterial;
