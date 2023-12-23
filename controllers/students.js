import Student from "../models/Student.js";
import Year from "../models/Year.js";

export const get_all = async (req, res, next) => {
  try {
    const student = await Student.find();
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
};

export const handle_vote = async (req, res, next) => {
  // check body
  if (!req.body.email || !req.body.to) {
    res.status(400).send("error: invalid body");
    return;
  }
  if ([0, 1, 2].indexOf(req.body.type) == -1) {
    res.status(400).send("error: invalid type");
    return;
  }

  // check ids
  try {
    const from_types = ["know_not", "know", "know_well"];
    const to_types = ["known_not_by", "known_by", "known_well_by"];
    const from = await Student.findOne({ _id: req.body.email });
    const to = await Student.findOne({ _id: req.body.to });

    // check and remove existing votes
    // from
    for (const type of from_types) {
      const tos = from[type];
      const i = tos.indexOf(to._id.toString());
      if (i != -1) {
        // remove old
        tos.splice(i, 1);
        await Student.updateOne({ _id: from._id }, { $set: { [type]: tos } });
      }
    }
    // to
    for (const type of to_types) {
      const tos = to[type];
      const i = tos.indexOf(from._id.toString());
      if (i != -1) {
        // remove old
        tos.splice(i, 1);
        await Student.updateOne({ _id: to._id }, { $set: { [type]: tos } });
      }
    }

    // add new vote
    // from
    var type = from_types[req.body.type];
    await Student.updateOne(
      { _id: from._id },
      {
        $set: {
          [type]: [...from[type], to._id.toString()],
        },
      }
    );
    // to
    type = to_types[req.body.type];
    await Student.updateOne(
      { _id: to._id },
      {
        $set: {
          [type]: [...to[type], from._id.toString()],
        },
      }
    );

    res.status(200).send("success");
  } catch (error) {
    next(error);
  }
};

export const foo = async (req, res, next) => {
  //   const students = [
  //     {
  //       email: "one@gmail.com",
  //       first: "one",
  //       last: "ONE",
  //       school_id: "1_123",
  //     },
  //     {
  //       email: "two@gmail.com",
  //       first: "two",
  //       last: "TWO",
  //       school_id: "2_123",
  //     },
  //   ];
  //   try {
  //     var saved_studnets = [];
  //     for (var student of students) {
  //       student = new Student(student);
  //       student = await student.save();
  //       saved_studnets.push(student._id.toString());
  //     }
  //     var year = new Year({
  //       school: "Hamilton College",
  //       year: 2025,
  //       students: saved_studnets,
  //     });
  //     year = await year.save();
  //     res.status(200).json(year);
  //   } catch (err) {
  //     next(err);
  //   }
};
