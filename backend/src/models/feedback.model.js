import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
    {
        gateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gate",
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
        },

        submittedAt: {
            type: Date,
            default: Date.now,
            expires: 3600
        }
    },
    { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
