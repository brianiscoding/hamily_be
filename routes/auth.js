import express from "express";
import { verify } from "../utils/verify.js";

const router = express.Router();
router.get("/login", verify, (req, res) =>
  res.status(200).json(res.locals.user)
);

export default router;
