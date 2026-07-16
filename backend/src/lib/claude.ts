import Anthropic from "@anthropic-ai/sdk";
import { env } from "../config/env";

let client: Anthropic | null = null;

export function getClaudeClient(): Anthropic {
  if (!env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to backend/.env to enable AI meal plan generation."
    );
  }
  if (!client) {
    client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  }
  return client;
}

export const CLAUDE_MODEL = "claude-sonnet-5";
