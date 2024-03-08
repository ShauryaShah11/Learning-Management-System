import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, // Reference to the Course
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the User who asked the question
        questionText: { type: String, required: true }, // Text of the question
        answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }], // Array of Answer references
    },
    { timestamps: true }
);

questionSchema.index({ course: 1 });

const Question = mongoose.model("Question", questionSchema);

export default Question;
