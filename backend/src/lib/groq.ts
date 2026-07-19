import Groq from "groq-sdk";
import { env } from "../config/env";

let client: Groq | null = null;

export function getGroqClient(): Groq {
  if (!env.GROQ_API_KEY) {
    throw new Error(
      "AI_PROVIDER_NOT_CONFIGURED: GROQ_API_KEY is not set. Get a free key at https://console.groq.com and add it to backend/.env."
    );
  }
  if (!client) {
    client = new Groq({ apiKey: env.GROQ_API_KEY });
  }
  return client;
}

// Meta's Llama 3.3 70B, served free via Groq — an open-weight model, not proprietary.
export const GROQ_MODEL = "llama-3.3-70b-versatile";
