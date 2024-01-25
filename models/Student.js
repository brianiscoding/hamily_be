import mongoose from "mongoose";
const Student_Schema = new mongoose.Schema({
  email: String,
  first: String,
  last: String,
  school_id: String,
  year: Number,
  participating: Boolean,

  knows: Number,
  know_not: [String],
  know: [String],
  know_well: [String],

  known_bys: Number,
  known_not_by: [String],
  known_by: [String],
  known_well_by: [String],
});

export default mongoose.model("Student", Student_Schema);
