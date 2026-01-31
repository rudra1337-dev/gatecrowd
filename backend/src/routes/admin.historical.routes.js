



import express from "express";
import { createHistorical, updateHistorical, getAllHistorical } from "../controllers/historical.controller.js";
import { bulkUploadHistorical } from "../controllers/historical.controller.js";

const router = express.Router();

// Create new historical record
router.post("/", createHistorical);

// Update existing record (by gate/day/time)
router.put("/:gateId/:dayOfWeek/:timeSlot", updateHistorical);

// Get all historical data
router.get("/", getAllHistorical);

//Create many or bulk historical ecord
router.post("/bulk", bulkUploadHistorical);

export default router;







