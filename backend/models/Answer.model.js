import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
    {
        question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" }, // Reference to the Question
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the User who answered
        answerText: { type: String, required: true },
    },
    { timestamps: true }
);

answerSchema.index({ question: 1 });

const Answer = mongoose.model("Answer", answerSchema);

export default Answer;
