// backend/src/services/geminiService.js
// Updated to accept optional context from contextBuilder

import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY, GEMINI_MODEL } from "../constants/env.js";
import chatSystemPrompt from "../prompts/chatSystemPrompt.js";

function createGeminiClient() {
  return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

/**
 * @param {string} userMessage
 * @param {string|null} context - live data block from contextBuilder, or null
 */
export async function getGeminiResponse(userMessage, context = null) {
  const ai = createGeminiClient();

  // Inject live data before the user question if available
  const contents = context
    ? `${context}\n\nUser question: ${userMessage}`
    : userMessage;

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents,
    config: {
      systemInstruction: chatSystemPrompt,
    },
  });

  const text = response.text;

  if (!text || text.trim().length === 0) {
    throw new Error("Empty response from Gemini");
  }

  return text.trim();
}