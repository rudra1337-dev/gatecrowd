import { getGeminiResponse } from "../services/geminiService.js";

export async function postChatMessage(req, res) {
  try {
    const { message } = req.body ?? {};

    if (typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "message is required" });
    }

    const reply = await getGeminiResponse(message.trim());

    return res.status(200).json({
      reply,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("[Chat Controller Error]", error.message);
    const errorMessage = error.message?.toLowerCase() ?? "";

    if (errorMessage.includes("api_key") || errorMessage.includes("api key") || errorMessage.includes("403")) {
      return res.status(500).json({ error: "AI service authentication failed" });
    }

    if (errorMessage.includes("quota") || errorMessage.includes("429")) {
      return res.status(429).json({ error: "AI service rate limit reached. Please try again shortly." });
    }

    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
