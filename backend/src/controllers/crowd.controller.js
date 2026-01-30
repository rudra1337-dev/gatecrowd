



import { crowdCache } from "../services/crowdCache.js";
import { calculateCurrentCrowd } from "../services/crowdCalculator.js";

export const getCurrentCrowd = async (req, res) => {
    try {
        const { gateId } = req.params;

        // If cached, return quickly
        if (crowdCache[gateId]) {
            return res.json(crowdCache[gateId]);
        }

        // otherwise calculate
        const result = await calculateCurrentCrowd(gateId);

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get crowd data" });
    }
};
