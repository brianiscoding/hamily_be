import mongoose from "mongoose";
const Student_Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  known_by: {
    type: [String],
  },
  know: {
    type: [String],
  },
});

export default mongoose.model("Student", Student_Schema);
