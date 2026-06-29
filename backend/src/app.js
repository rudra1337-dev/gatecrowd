import express from "express";
import gateRoutes from "./routes/gate.routes.js";
import adminGateRoutes from "./routes/admin.gate.routes.js"
import crowdRoutes from "./routes/crowd.routes.js";
import adminHistoricalRoutes from "./routes/admin.historical.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import chatRoutes from "./routes/chat.routes.js";

const app = express();

app.use(express.json());

// Routes
app.use("/api/gates", gateRoutes);
app.use("/api/admin", adminGateRoutes);
app.use("/api/crowd", crowdRoutes);
app.use("/api/admin/historical", adminHistoricalRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/chat", chatRoutes);



export default app;
