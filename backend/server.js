import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";

import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { FRONTEND_URL, GEMINI_API_KEY, GEMINI_MODEL, PORT } from "./src/constants/env.js";

import appRoutes from "./src/app.js"; // your existing express app
import {
    startLiveUpdates,
    stopLiveUpdates
} from "./src/services/crowdCalculator.js";
import { GATE_IDS } from "./src/constants/gates.js";
import { setIO } from "./src/utils/socket.js";

if (!GEMINI_API_KEY || !GEMINI_MODEL) {
    console.error("[FATAL] GEMINI_API_KEY and GEMINI_MODEL must be set in .env");
    process.exit(1);
}

// --- CREATE EXPRESS APP ---
const app = express();

// --- Security Middlewares ---
app.use(helmet()); // secure headers
app.use(cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Rate limiter
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // max 60 requests per IP
    message: "Too many requests, try again later."
});
app.use(limiter);

// --- JSON parsing ---
app.use(express.json());

// --- YOUR EXISTING ROUTES ---
app.use("/", appRoutes);

// --- CREATE HTTP SERVER ---
const server = createServer(app);

// --- SOCKET.IO SETUP ---
export const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    }
});

setIO(io);

// Track connected clients
let connectedClients = 0;

io.on("connection", (socket) => {
    connectedClients++;
    console.log("Client connected:", socket.id, "Total:", connectedClients);

    if (connectedClients === 1) {
        console.log("Starting live crowd updates...");
        GATE_IDS.forEach((gateId) => startLiveUpdates(gateId));
    }

    socket.on("disconnect", () => {
        connectedClients--;
        console.log("Client disconnected:", socket.id, "Total:", connectedClients);

        if (connectedClients === 0) {
            console.log("Stopping live crowd updates...");
            stopLiveUpdates();
        }
    });
});

// --- START SERVER AFTER DB CONNECTS ---
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
});
