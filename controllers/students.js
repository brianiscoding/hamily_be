import Student from "../models/student.js";

export const get_all = async (req, res, next) => {
  try {
    const student = await Student.find();
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
};
