import Gate from "../models/gate.model.js";
import { io } from "../../server.js";








// Get all gates
export const getAllGates = async (req, res) => {
    try {
        const gates = await Gate.find();

        // Emit gates via socket to all connected clients
        io.emit("gates:update", gates);

        res.status(200).json(gates);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};








// Create gate
export const createGate = async (req, res) => {
    try {
        const gate = await Gate.create(req.body);
        res.status(201).json(gate);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};






// Update gate
export const updateGate = async (req, res) => {
    try {
        const gate = await Gate.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(gate);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
