import Feedback from "../models/feedback.model.js";
import Historical from "../models/historical.model.js";
import { crowdCache } from "./crowdCache.js";

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
    const tenMinAgo = new Date(now - 10 * 60 * 1000);
    const oneHourAgo = new Date(now - 60 * 60 * 1000);

    const feedbacks = await Feedback.find({
        gateId,
        createdAt: { $gte: tenMinAgo }
    })
        .sort({ createdAt: -1 })
        .limit(50);

    let level, range;

    if (feedbacks.length > 0) {
        const avgScore =
            feedbacks.reduce(
                (sum, f) => sum + levelScore[f.crowdLevel],
                0
            ) / feedbacks.length;

        [level, range] = scoreToLevel(avgScore);
    } else {
        const olderFeedback = await Feedback.findOne({
            gateId,
            createdAt: { $gte: oneHourAgo }
        });

        if (!olderFeedback) {
            const day = new Date().toLocaleString("en-US", {
                weekday: "long"
            });

            const historical = await Historical.findOne({
                gateId,
                dayOfWeek: day
            });

            if (historical) {
                level = historical.crowdLevel;
                range = historical.peopleRange;
            } else {
                level = "MODERATE";
                range = "31-60";
            }
        } else {
            if (crowdCache[gateId]) {
                return crowdCache[gateId];
            }

            // fallback: calculate using last hour feedback
            const lastHourFeedbacks = await Feedback.find({
                gateId,
                createdAt: { $gte: oneHourAgo }
            }).limit(50);

            if (lastHourFeedbacks.length > 0) {
                const avgScore =
                    lastHourFeedbacks.reduce(
                        (sum, f) => sum + levelScore[f.crowdLevel],
                        0
                    ) / lastHourFeedbacks.length;

                [level, range] = scoreToLevel(avgScore);
            }
        }

    }

    crowdCache[gateId] = {
        crowdLevel: level,
        peopleRange: range,
        updatedAt: new Date()
    };

    return crowdCache[gateId];
};













let interval;

export const startLiveUpdates = (gateId) => {
    interval = setInterval(() => {
        calculateCurrentCrowd(gateId);
    }, 60000);
};

export const stopLiveUpdates = () => {
    clearInterval(interval);
};
