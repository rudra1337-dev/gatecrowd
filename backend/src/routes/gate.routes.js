import express from "express";
import { getAllGates } from "../controllers/gate.controller.js";

const router = express.Router();

// GET /api/gates
router.get("/", getAllGates);

export default router;
