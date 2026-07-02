// backend/src/controllers/chat.controller.js
// Orchestrates: intentRouter → functionRegistry → contextBuilder → geminiService

import { getGeminiResponse } from "../services/geminiService.js";
import { detectIntents }     from "../services/intentRouter.js";
import { callFunctions }     from "../services/functionRegistry.js";
import { buildContext }      from "../services/contextBuilder.js";

export async function postChatMessage(req, res) {
  try {
    const { message } = req.body ?? {};

    if (typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "message is required" });
    }

    const userMessage = message.trim();

    // Step 1 — what does the user need?
    const intents = detectIntents(userMessage);
    console.log(`[Chat] intents: ${intents.length ? intents.join(", ") : "none (general)"}`);

    // Step 2 — fetch data for matched intents (skipped if general question)
    const functionResults = intents.length > 0 ? await callFunctions(intents) : {};

    // Step 3 — build context string (null if no data fetched)
    const context = buildContext(functionResults);

    // Step 4 — send to Gemini with or without live data
    const reply = await getGeminiResponse(userMessage, context);

    return res.status(200).json({
      reply,
      timestamp: new Date().toISOString(),
      // _debug: remove before production
      // _debug: { intents, hadLiveData: !!context },
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