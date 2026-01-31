






import mongoose from "mongoose";
import Feedback from "../models/feedback.model.js";
import Gate from "../models/gate.model.js";

const VALID_LEVELS = [
    "LOW",
    "MODERATE",
    "HIGH",
    "VERY_HIGH",
    "EXTREME"
];

const VALID_RANGES = [
    "0-30",
    "31-60",
    "61-90",
    "91-120",
    "120+"
];

// Optional: strict mapping (recommended)
const LEVEL_RANGE_MAP = {
    LOW: "0-30",
    MODERATE: "31-60",
    HIGH: "61-90",
    VERY_HIGH: "91-120",
    EXTREME: "120+"
};

export const submitFeedback = async (req, res) => {
    try {
        const { gateId, crowdLevel, peopleRange } = req.body;

        // 1️⃣ Basic presence check
        if (!gateId || !crowdLevel || !peopleRange) {
            return res.status(400).json({
                message: "gateId, crowdLevel and peopleRange are required"
            });
        }

        // 2️⃣ Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(gateId)) {
            return res.status(400).json({ message: "Invalid gateId" });
        }

        // 3️⃣ Validate enums
        if (!VALID_LEVELS.includes(crowdLevel)) {
            return res.status(400).json({ message: "Invalid crowdLevel" });
        }

        if (!VALID_RANGES.includes(peopleRange)) {
            return res.status(400).json({ message: "Invalid peopleRange" });
        }

        // 4️⃣ Logical validation (VERY IMPORTANT)
        if (LEVEL_RANGE_MAP[crowdLevel] !== peopleRange) {
            return res.status(400).json({
                message: "crowdLevel and peopleRange do not match"
            });
        }

        // 5️⃣ Check gate exists & active
        const gate = await Gate.findById(gateId);
        if (!gate || !gate.isActive) {
            return res.status(404).json({
                message: "Gate not found or inactive"
            });
        }

        // 6️⃣ Save feedback
        const feedback = await Feedback.create({
            gateId,
            crowdLevel,
            peopleRange
        });

        res.status(201).json({
            message: "Thank you for your feedback 🙏",
            feedbackId: feedback._id
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
