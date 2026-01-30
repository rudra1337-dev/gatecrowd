import mongoose from "mongoose";

const historicalSchema = new mongoose.Schema(
    {
        gateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gate",
            required: true
        },

        dayOfWeek: {
            type: String,
            enum: [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],
            required: true
        },

        timeSlot: {
            type: String, // Example: "06-08"
            required: true
        },

        crowdLevel: {
            type: String,
            enum: [
                "LOW",
                "MODERATE",
                "HIGH",
                "VERY_HIGH",
                "EXTREME"
            ],
            required: true
        },

        peopleRange: {
            type: String,
            enum: [
                "0-30",
                "31-60",
                "61-90",
                "91-120",
                "120+"
            ],
            required: true
        }
    },
    { timestamps: true }
);

// Prevent duplicate records per gate/day/time
historicalSchema.index(
    { gateId: 1, dayOfWeek: 1, timeSlot: 1 },
    { unique: true }
);

export default mongoose.model("Historical", historicalSchema);
