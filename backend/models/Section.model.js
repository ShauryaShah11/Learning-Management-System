import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, 
    subsections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subsection" }],
}, { timestamps: true }); // Enable timestamps

const Section = mongoose.model("Section", sectionSchema);

export default Section;