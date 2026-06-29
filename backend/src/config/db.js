import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env.js";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Database connected");
    } catch (error) {
        console.error("DB connection failed:", error);
        process.exit(1);
    }
};


export default connectDB;
