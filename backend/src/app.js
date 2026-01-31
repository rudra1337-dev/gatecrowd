import express from "express";
import cors from "cors";
import gateRoutes from "./routes/gate.routes.js";
import adminGateRoutes from "./routes/admin.gate.routes.js"
import crowdRoutes from "./routes/crowd.routes.js";
import adminHistoricalRoutes from "./routes/admin.historical.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/gates", gateRoutes);
app.use("/api/admin", adminGateRoutes);
app.use("/api/crowd", crowdRoutes);
app.use("/api/admin/historical", adminHistoricalRoutes);
app.use("/api/feedback", feedbackRoutes);



export default app;
