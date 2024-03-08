import mongoose from "mongoose";

const isPositiveNumber = (value) => {
    return value >= 0; // Returns true if the value is a positive number or zero
};

const tutorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
            index: true,
        },
        yearOfExperience: {
            type: Number,
            validate: { validator: isPositiveNumber },
        },
        coursesTeaching: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        ],
        bio: { type: String, maxlength: 500 }, // Example validation
        expertise: { type: String }, // Changed to String
        achievements: { type: String }, // Changed to String
        ratings: { type: Number, default: 0 }, // Store individual reviews for calculation
    },
    { timestamps: true }
);

tutorSchema.virtual("averageRating").get(function () {
    // Calculate average rating based on stored reviews
});

const Tutor = mongoose.model("Tutor", tutorSchema);

export default Tutor;
