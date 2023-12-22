import express from "express";
import { get_all } from "../controllers/students.js";
const router = express.Router();

//get
router.get("/get_all", get_all);

export default router;
