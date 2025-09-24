import express from "express";

import { createStudent }  from "../controllers/demo.js";

const router = express.Router();

// define your routes
router.post("/",createStudent)

export default router;