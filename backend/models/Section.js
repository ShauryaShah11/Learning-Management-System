import mongoose from 'mongoose';

const subSectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true }, // e.g., video, pdf, quiz, article
    url: { type: String, required: true }, // URL or CMS reference
    fileSize: { type: Number }, // Optional for specific types
    duration: { type: Number }, // Optional for videos
    order: { type: Number, default: 0 }, // Resource order
    completedByStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const sectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subsections: [subSectionSchema] // Embedding subSectionSchema within subsections array
});

const Section = mongoose.model('Section', sectionSchema);

export default Section;
