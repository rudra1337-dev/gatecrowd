import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
export const MONGO_URI = process.env.MONGO_URI;
