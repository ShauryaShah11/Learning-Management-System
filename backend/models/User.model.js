import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator"; // Assuming you're using the validator library

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, index: true },
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true, minlength: 8 },
        firstName: { type: String },
        lastName: { type: String },
        avatarUrl: { type: String },
        contactNumber: {
            type: String,
            validate: [validator.isMobilePhone, "Invalid phone number"], // Example validation using validator library
        },
        age: { type: Number },
        role: {
            type: String,
            enum: ["student", "tutor", "admin"],
            default: "student",
            index: true,
        },
        isVerified: { type: Boolean, default: false },
        isRemoved: {
            type: Boolean,
            default: false,
        },
        verificationToken: { type: String, expires: "1h" }, // Token expiration
        passwordResetToken: { type: String, expires: "1h" }, // Token expiration
    },
    { timestamps: true }
);

// Hash password before saving or updating
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model("User", userSchema);

export default User;
