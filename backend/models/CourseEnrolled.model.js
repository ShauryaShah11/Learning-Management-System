import mongoose from "mongoose";

const courseEnrolledSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        enrolledDate: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ["in progress", "completed", "dropped out"],
            default: "in progress",
        },
        progress: { type: Number, min: 0, max: 100, default: 0 }, // percentage progress
        certificateIssued: { type: Boolean, default: false },
    },
    { timestamps: true }
);

courseEnrolledSchema.index({ course: 1, student: 1 }, { unique: true });

const CourseEnrolled = mongoose.model("CourseEnrolled", courseEnrolledSchema);

export default CourseEnrolled;
