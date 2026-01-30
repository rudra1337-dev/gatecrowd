import express from "express";
import { getCurrentCrowd } from "../controllers/crowd.controller.js";

const router = express.Router();

router.get("/:gateId", getCurrentCrowd);

export default router;
