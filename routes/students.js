import express from "express";
import {
  get_students,
  handle_vote,
  get_ranking,
  update_bio,
} from "../controllers/students.js";
import { verify } from "../utils/verify.js";
const router = express.Router();

// get to vote
router.get("/vote/:year/:new_old/:max", verify, get_students);
// get ranking
router.get("/ranking/:year", get_ranking);
// handle vote
router.patch("/vote", verify, handle_vote);
// update bio
router.patch("/bio", verify, update_bio);

export default router;
