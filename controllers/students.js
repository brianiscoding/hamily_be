import Student from "../models/Student.js";

export const update_bio = async (req, res) => {
  const bio = req.body.bio;
  if (bio.length > 100) {
    res.status(400).send("fail");
    return;
  }

  try {
    await Student.updateOne({ _id: res.locals.user._id }, { $set: { bio } });
    res.status(200).json("success");
  } catch (err) {
    res.status(400).send("fail");
  }
};

export const get_ranking = async (req, res) => {
  var year = ["senior", "junior", "sophomore", "freshman", "all"].indexOf(
    req.params.year
  );
  if (year === -1) {
    res.status(400).send("invalid year");
    return;
  }

  try {
    var filter = {};
    if (req.params.year !== "all") {
      const date = new Date();
      year = date.getFullYear() + year;
      if (date.getMonth() > 5) year++;
      filter = { year };
    }

    var students = await Student.find(filter, {
      _id: 0,
      email: 0,
      know_not: 0,
      know: 0,
      know_well: 0,
    })
      .sort({ known_bys: -1 })
      .limit(10);

    students = students.map((x) => ({
      first: x.first,
      last: x.last,
      year: x.year,
      knows: x.knows,
      known_bys: x.known_bys,
      bio: x.bio,
      // split: [x.known_not_by.length, x.known_by.length, x.known_well_by.length],
    }));

    res.status(200).json(students);
  } catch (err) {
    res.status(400).send("fail");
  }
};

export const get_students = async (req, res) => {
  var year = ["senior", "junior", "sophomore", "freshman"].indexOf(
    req.params.year
  );
  if (year == -1) {
    res.status(400).send("invalid year");
    return;
  }

  const b = ["new", "old"].indexOf(req.params.new_old);
  if (b == -1) {
    res.status(400).send("invalid new_old");
    return;
  }

  const date = new Date();
  year = date.getFullYear() + year;
  if (date.getMonth() > 5) year++;
  const user = res.locals.user;
  try {
    var students = await Student.find(
      {
        _id: {
          [`$${[["nin", "in"][b]]}`]: user.know_not.concat(
            user.know,
            user.know_well
          ),
          // ignore self
          $ne: user._id.toString(),
        },
        year: year,
      },
      {
        email: 0,
        school_id: 0,
        year: 0,
        know_not: 0,
        know: 0,
        know_well: 0,
        known_not_by: 0,
        known_by: 0,
        known_well_by: 0,
      }
    ).sort({ known_bys: -1 });

    if (b) {
      students = students.map((x) => {
        for (const type of ["know_not", "know", "know_well"]) {
          const tos = res.locals.user[type];
          const i = tos.indexOf(x._id.toString());
          if (i === -1) continue;
          return {
            _id: x._id.toString(),
            first: x.first,
            last: x.last,
            knows: x.knows,
            known_bys: x.known_bys,
            type,
            bio: x.bio,
          };
        }
      });
    }

    res.status(200).json({
      max: students.length,
      students: students.splice(0, parseInt(req.params.max)),
    });
  } catch (err) {
    res.status(400).send("fail");
  }
};

export const handle_vote = async (req, res) => {
  // check body
  if (!req.body.to) {
    res.status(400).send("invalid body");
    return;
  }
  const k = ["know_not", "know", "know_well"].indexOf(req.body.type);
  if (k === -1) {
    res.status(400).send("invalid body");
    return;
  }

  // check ids
  try {
    const from_types = ["know_not", "know", "know_well"];
    const to_types = ["known_not_by", "known_by", "known_well_by"];
    const from = await Student.findOne({ email: res.locals.user.email });
    const to = await Student.findOne({ _id: req.body.to });

    // check and remove existing votes
    // from
    for (const type of from_types) {
      const tos = from[type];
      const i = tos.indexOf(to._id.toString());
      if (i != -1) {
        // remove old
        tos.splice(i, 1);
        await Student.updateOne(
          { _id: from._id },
          { $set: { [type]: tos }, $inc: { knows: -1 } }
        );
      }
    }
    // to
    for (let i = 0; i < 3; i++) {
      const type = to_types[i];
      const froms = to[type];
      const j = froms.indexOf(from._id.toString());
      if (j != -1) {
        // remove old
        froms.splice(j, 1);
        await Student.updateOne(
          { _id: to._id },
          { $set: { [type]: froms }, $inc: { known_bys: -1 * i } }
        );
      }
    }

    // add new vote
    // from
    var type = from_types[k];
    await Student.updateOne(
      { _id: from._id },
      {
        $set: {
          [type]: [...from[type], to._id.toString()],
        },
        $inc: { knows: 1 },
      }
    );
    // to
    type = to_types[k];
    await Student.updateOne(
      { _id: to._id },
      {
        $set: {
          [type]: [...to[type], from._id.toString()],
        },
        $inc: { known_bys: k },
      }
    );

    res.status(200).send("success");
  } catch (err) {
    res.status(400).send("fail");
  }
};

// console.log("TEST");
// const x = await Student.updateMany(
//   {},
//   {
//     $set: {
//       bio: "Hello Hamily!",
//       knows: 0,
//       know_not: [],
//       know: [],
//       know_well: [],

//       known_bys: 0,
//       known_not_by: [],
//       known_by: [],
//       known_well_by: [],
//     },
//   },
//   {
//     upsert: false,
//     multi: true,
//   }
// );
// console.log(x);
// res.status(400).send("success");
// return;
