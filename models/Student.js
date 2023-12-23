import mongoose from "mongoose";
const Student_Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  first: {
    type: String,
    required: true,
  },
  last: {
    type: String,
    required: true,
  },
  school_id: {
    type: String,
    required: true,
  },
  known_not_by: {
    type: [String],
  },
  know_not: {
    type: [String],
  },
  known_by: {
    type: [String],
  },
  know: {
    type: [String],
  },
  known_well_by: {
    type: [String],
  },
  know_well: {
    type: [String],
  },
});

export default mongoose.model("Student", Student_Schema);
