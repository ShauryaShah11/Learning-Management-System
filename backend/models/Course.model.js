import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        courseName: { type: String, required: true },
        price: { type: Number, required: true, min: 0 }, // Ensuring non-negative price
        duration: { type: String, required: true },
        description: { type: String, required: true },
        level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            required: true,
        },
        prerequisites: [{ type: String }], // Array of strings to store prerequisites
        language: { type: String, required: true },
        thumbnailUrl: { type: String }, // Basic URL format validation
        duration: { type: String, required: true },
        numberOfMaterials: { type: Number, default: 0 },
        published: { type: Boolean, default: false },
        tutor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }, // Making tutor required
        studentsEnrolled: [
            { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        ],
        reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseCategory",
            required: true,
        },
        isRemoved: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

courseSchema.index({
    courseName: 1,
    tutor: 1,
    category: 1,
    published: 1,
    level: 1,
});
const Course = mongoose.model("Course", courseSchema);

export default Course;
