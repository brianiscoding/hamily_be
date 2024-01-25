import Student from "../models/Student.js";
import axios from "axios";

export const verify = (req, res, next) => {
  const token = req.cookies.user_access_token;
  if (!token) {
    res.status(400).send("no login");
    return;
  }

  axios
    .get("https://www.googleapis.com/oauth2/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      params: { access_token: token },
    })
    .then(async (data) => {
      if (data.data.hd !== "hamilton.edu") {
        res.status(400).send("invalid email");
        return;
      }

      const user = await Student.findOne({
        email: data.data.email.split("@")[0],
      });
      if (user) {
        res.locals.user = user;
        next();
      } else res.status(400).send("invalid email");
    })
    .catch((err) => res.status(400).send("bad request"));
};
