import express from "express";
import { get_all, foo, handle_vote } from "../controllers/students.js";
const router = express.Router();

// get
router.get("/all", get_all);

// handle vote
router.patch("/vote", handle_vote);

// foo
router.get("/foo", foo);

export default router;
