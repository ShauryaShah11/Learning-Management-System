import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator"; // Assuming you're using the validator library

const userSchema = new mongoose.Schema({
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
  age: { type: String }, // Changed to String for flexibility
  role: {
    type: String,
    enum: ["student", "tutor", "admin"],
    default: "student",
    index: true, // Add index for role
  },
  isVerified: { type: Boolean, default: false },
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: { type: Date, default: Date.now },
  verificationToken: { type: String, expires: "1h" }, // Token expiration
  passwordResetToken: { type: String, expires: "1h" }, // Token expiration
});

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
