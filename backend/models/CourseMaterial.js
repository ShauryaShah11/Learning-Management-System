import mongoose from "mongoose";

const courseMaterialSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  resources: [{
    type: { type: String, required: true }, // e.g., video, pdf, quiz, article
    title: { type: String, required: true },
    description: { type: String }, // Optional
    url: { type: String, required: true }, // URL or CMS reference
    fileSize: { type: Number }, // Optional for specific types
    duration: { type: Number }, // Optional for videos
    order: { type: Number, default: 0 }, // Resource order
    completedByStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  }],
});
courseMaterialSchema.index({ course: 1 });
courseMaterialSchema.index({ type: 1, order: 1 }); // Example for filtering
const CourseMaterial = mongoose.model('CourseMaterial', courseMaterialSchema);

module.exports = CourseMaterial;
