import express from "express";
import { postChatMessage } from "../controllers/chat.controller.js";

const router = express.Router();
const requestsByIp = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 20;

function chatRateLimiter(req, res, next) {
  const now = Date.now();
  const ip = req.ip ?? req.socket?.remoteAddress ?? "unknown";
  const current = requestsByIp.get(ip);

  if (!current || now - current.windowStart >= WINDOW_MS) {
    requestsByIp.set(ip, { count: 1, windowStart: now });
    return next();
  }

  if (current.count >= MAX_REQUESTS) {
    return res.status(429).json({ error: "Too many requests, try again later." });
  }

  current.count += 1;
  return next();
}

router.use(express.json());
router.use(chatRateLimiter);
router.post("/", postChatMessage);

export default router;
