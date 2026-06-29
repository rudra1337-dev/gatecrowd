import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY, GEMINI_MODEL } from "../constants/env.js";
import chatSystemPrompt from "../prompts/chatSystemPrompt.js";

function createGeminiClient() {
  return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

export async function getGeminiResponse(userMessage) {
  const ai = createGeminiClient();

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: userMessage,
    config: {
      systemInstruction: chatSystemPrompt
    }
  });

  const text = response.text;

  if (!text || text.trim().length === 0) {
    throw new Error("Empty response from Gemini");
  }

  return text.trim();
}
