import mongoose from "mongoose";

const Year_Schema = new mongoose.Schema({
  school: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  students: {
    type: [String],
  },
  feautred: {
    type: [String],
  },
});

export default mongoose.model("Year", Year_Schema);
