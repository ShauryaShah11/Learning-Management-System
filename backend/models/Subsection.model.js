import mongoose from "mongoose";

const subSectionSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        type: { type: String, required: true }, // e.g., video, pdf, quiz, article
        url: { type: String, required: true }, // URL or CMS reference
        duration: { type: Number }, // Optional for videos
        order: { type: Number, default: 0 }, // Resource order
        section: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
    },
    { timestamps: true }
);

const Subsection = mongoose.model("Subsection", subSectionSchema);

export default Subsection;
