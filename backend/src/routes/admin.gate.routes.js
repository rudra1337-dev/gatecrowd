import express from "express";
import { createGate, updateGate } from "../controllers/gate.controller.js";

const router = express.Router();

router.post("/gates", createGate);       // create gate
router.put("/gates/:id", updateGate);    // update gate

export default router;
