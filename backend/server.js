import http from "http";
import app from "./src/app.js";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Socket.IO setup
export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Socket connection
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// ✅ Start server ONLY after DB connects
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
