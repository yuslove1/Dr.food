import Anthropic from "@anthropic-ai/sdk";
import { env } from "../config/env";

let client: Anthropic | null = null;

export function getClaudeClient(): Anthropic {
  if (!env.ANTHROPIC_API_KEY) {
    throw new Error(
      "AI_PROVIDER_NOT_CONFIGURED: ANTHROPIC_API_KEY is not set. Add it to backend/.env, or set AI_PROVIDER=groq for a free alternative."
    );
  }
  if (!client) {
    client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  }
  return client;
}

export const CLAUDE_MODEL = "claude-sonnet-5";
