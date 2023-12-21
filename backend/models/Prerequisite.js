import mongoose from "mongoose";

const prerequisiteSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Reference main course
  prerequisites: [{ type: String }], // Array of strings to store prerequisites
  fulfilled: { type: Boolean, default: false }, // Track fulfillment status
  dateFulfilled: { type: Date } // Optional timestamp for fulfillment date
});

const Prerequisite = mongoose.model('Prerequisite', prerequisiteSchema);

export default Prerequisite;
