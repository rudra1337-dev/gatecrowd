





import mongoose from "mongoose";
import Historical from "../models/historical.model.js";

// Allowed enums
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const CROWD_LEVELS = ["LOW", "MODERATE", "HIGH", "VERY_HIGH", "EXTREME"];
const PEOPLE_RANGES = ["0-30", "31-60", "61-90", "91-120", "120+"];

// Helper to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);










// --- Create Historical ---
export const createHistorical = async (req, res) => {
    try {
        const { gateId, dayOfWeek, timeSlot, crowdLevel, peopleRange } = req.body;

        // ✅ Validations
        if (!gateId || !isValidObjectId(gateId)) return res.status(400).json({ message: "Invalid gateId" });
        if (!dayOfWeek || !DAYS.includes(dayOfWeek)) return res.status(400).json({ message: "Invalid dayOfWeek" });
        if (!timeSlot || !/^\d{2}-\d{2}$/.test(timeSlot)) return res.status(400).json({ message: "Invalid timeSlot format. Use 'HH-HH'" });
        if (!crowdLevel || !CROWD_LEVELS.includes(crowdLevel)) return res.status(400).json({ message: "Invalid crowdLevel" });
        if (!peopleRange || !PEOPLE_RANGES.includes(peopleRange)) return res.status(400).json({ message: "Invalid peopleRange" });

        const historical = await Historical.create(req.body);
        res.status(201).json(historical);

    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Record already exists for this gate/day/time" });
        }
        res.status(500).json({ message: err.message });
    }
};










// --- Update Historical ---
export const updateHistorical = async (req, res) => {
    try {
        const { gateId, dayOfWeek, timeSlot } = req.params;
        const { crowdLevel, peopleRange } = req.body;

        // ✅ Validations
        if (!gateId || !isValidObjectId(gateId)) return res.status(400).json({ message: "Invalid gateId" });
        if (!dayOfWeek || !DAYS.includes(dayOfWeek)) return res.status(400).json({ message: "Invalid dayOfWeek" });
        if (!timeSlot || !/^\d{2}-\d{2}$/.test(timeSlot)) return res.status(400).json({ message: "Invalid timeSlot format. Use 'HH-HH'" });
        if (crowdLevel && !CROWD_LEVELS.includes(crowdLevel)) return res.status(400).json({ message: "Invalid crowdLevel" });
        if (peopleRange && !PEOPLE_RANGES.includes(peopleRange)) return res.status(400).json({ message: "Invalid peopleRange" });

        const updated = await Historical.findOneAndUpdate(
            { gateId, dayOfWeek, timeSlot },
            req.body,
            { new: true, upsert: true } // create if not exists
        );

        res.json(updated);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};








// --- Get all historical ---
export const getAllHistorical = async (req, res) => {
    try {
        const data = await Historical.find().populate("gateId", "name");
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};














//Bulk upload for admin

export const bulkUploadHistorical = async (req, res) => {
    try {
        const records = req.body;

        if (!Array.isArray(records) || records.length === 0) {
            return res.status(400).json({
                message: "Request body must be a non-empty array"
            });
        }

        // insertMany allows bulk insert
        const result = await Historical.insertMany(records, {
            ordered: false // continues even if some fail (duplicate etc.)
        });

        res.status(201).json({
            message: "Historical data uploaded",
            inserted: result.length
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
