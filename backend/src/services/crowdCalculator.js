import Feedback from "../models/feedback.model.js";
import Historical from "../models/historical.model.js";
import { crowdCache } from "./crowdCache.js";
import { getIO } from "../utils/socket.js";

const levelScore = {
    LOW: 1,
    MODERATE: 2,
    HIGH: 3,
    VERY_HIGH: 4,
    EXTREME: 5
};

const scoreToLevel = (score) => {
    if (score <= 1.5) return ["LOW", "0-30"];
    if (score <= 2.5) return ["MODERATE", "31-60"];
    if (score <= 3.5) return ["HIGH", "61-90"];
    if (score <= 4.5) return ["VERY_HIGH", "91-120"];
    return ["EXTREME", "120+"];
};

export const calculateCurrentCrowd = async (gateId) => {
    const now = Date.now();
    const fifteenMinAgo = new Date(now - 15 * 60 * 1000);
    const oneHourAgo = new Date(now - 60 * 60 * 1000);

    let level, range;

    // 1) Most recent window (last 15 minutes) aggregated (max 10) to avoid single spam
    const recentFeedbacks = await Feedback.find({
        gateId,
        createdAt: { $gte: fifteenMinAgo }
    })
        .sort({ createdAt: -1 })
        .limit(10);

    if (recentFeedbacks.length > 0) {
        const avgScore =
            recentFeedbacks.reduce(
                (sum, f) => sum + levelScore[f.crowdLevel],
                0
            ) / recentFeedbacks.length;

        [level, range] = scoreToLevel(avgScore);
    } else {
        // 2) Average last hour feedbacks if any
        const lastHourFeedbacks = await Feedback.find({
            gateId,
            createdAt: { $gte: oneHourAgo }
        })
            .sort({ createdAt: -1 })
            .limit(50);

        if (lastHourFeedbacks.length > 0) {
            const avgScore =
                lastHourFeedbacks.reduce(
                    (sum, f) => sum + levelScore[f.crowdLevel],
                    0
                ) / lastHourFeedbacks.length;

            [level, range] = scoreToLevel(avgScore);
        } else {
            // 3) Historical fallback by day/time slot
            const day = new Date().toLocaleString("en-US", {
                weekday: "long"
            });

            const slot = getCurrentTimeSlot();

            if (!slot) {
                level = "LOW";
                range = "0-30";
            } else {
                const historical = await Historical.findOne({
                    gateId,
                    dayOfWeek: day,
                    timeSlot: slot
                });

                if (historical) {
                    level = historical.crowdLevel;
                    range = historical.peopleRange;
                } else {
                    level = "MODERATE";
                    range = "31-60";
                }
            }
        }
    }

    const result = {
        crowdLevel: level,
        peopleRange: range,
        updatedAt: new Date()
    };

    crowdCache[gateId] = result;
    return result;
};




const getCurrentTimeSlot = () => {
    const now = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const hour = now.getHours();

    if (hour >= 5 && hour < 9) return "05-09";
    if (hour >= 9 && hour < 13) return "09-13";
    if (hour >= 13 && hour < 17) return "13-17";
    if (hour >= 17 && hour < 22) return "17-22";

    return null;
};






let intervals = {};

export const startLiveUpdates = (gateId) => {
    if (intervals[gateId]) return; // 🚫 prevent duplicate

    const tick = async () => {
        const snapshot = await calculateCurrentCrowd(gateId);
        getIO()?.emit("gate:crowd:update", { gateId, ...snapshot });
    };

    // run once immediately for freshness
    tick().catch((err) => console.error("live update error", err));

    intervals[gateId] = setInterval(() => {
        tick().catch((err) => console.error("live update error", err));
    }, 60000);

    console.log("▶️ Live updates started for gate:", gateId);
};

export const stopLiveUpdates = () => {
    Object.values(intervals).forEach(clearInterval);
    intervals = {};
    console.log("⏹️ Live updates stopped for all gates");
};








// let interval;

// export const startLiveUpdates = (gateId) => {
//     interval = setInterval(() => {
//         calculateCurrentCrowd(gateId);
//     }, 60000);
// };

// export const stopLiveUpdates = () => {
//     clearInterval(interval);
// };
