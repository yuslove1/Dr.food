import { getClaudeClient, CLAUDE_MODEL } from "../../lib/claude";
import { getGroqClient, GROQ_MODEL } from "../../lib/groq";
import { env } from "../../config/env";
import type { FoodItem } from "@prisma/client";

export interface AiPlanMeal {
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
  foodName: string;
  servings: number;
}

export interface AiPlanDay {
  dayOfWeek: number;
  meals: AiPlanMeal[];
}

export interface AiPlanResult {
  days: AiPlanDay[];
  notes: string;
}

interface PlanProfile {
  age?: number | null;
  gender?: string | null;
  activityLevel?: string | null;
  goals: string[];
  medicalConditions: string[];
  dietaryRestrictions: string[];
  allergies: string[];
  budgetAmount?: number | null;
  budgetPeriod?: string | null;
}

const TOOL_NAME = "create_meal_plan";
const TOOL_DESCRIPTION = "Return a structured 7-day Nigerian meal plan built only from the provided food list.";

// Shared JSON Schema — both Claude (`input_schema`) and Groq's OpenAI-style function
// calling (`parameters`) accept the same JSON Schema shape, just under different keys.
const MEAL_PLAN_SCHEMA = {
  type: "object" as const,
  properties: {
    days: {
      type: "array",
      minItems: 7,
      maxItems: 7,
      items: {
        type: "object",
        properties: {
          dayOfWeek: { type: "integer", minimum: 0, maximum: 6 },
          meals: {
            type: "array",
            items: {
              type: "object",
              properties: {
                mealType: { type: "string", enum: ["BREAKFAST", "LUNCH", "DINNER", "SNACK"] },
                foodName: { type: "string", description: "Must exactly match a name from the provided food list" },
                servings: { type: "number", minimum: 0.5, maximum: 4 },
              },
              required: ["mealType", "foodName", "servings"],
            },
          },
        },
        required: ["dayOfWeek", "meals"],
      },
    },
    notes: { type: "string", description: "Short note on how the plan addresses the user's goals/conditions" },
  },
  required: ["days", "notes"],
};

function buildPrompt(profile: PlanProfile, availableFoods: FoodItem[]) {
  const foodList = availableFoods
    .map((f) => `- ${f.name} (${f.category}, ~${Math.round(f.caloriesPer100g)} kcal/100g, tags: ${f.tags.join(", ") || "none"})`)
    .join("\n");

  const profileSummary = `
Age: ${profile.age ?? "unknown"}
Gender: ${profile.gender ?? "unknown"}
Activity level: ${profile.activityLevel ?? "MODERATE"}
Goals: ${profile.goals.join(", ") || "general healthy eating"}
Medical conditions: ${profile.medicalConditions.join(", ") || "none"}
Dietary restrictions: ${profile.dietaryRestrictions.join(", ") || "none"}
Allergies: ${profile.allergies.join(", ") || "none"}
Budget: ${profile.budgetAmount ? `₦${profile.budgetAmount} per ${profile.budgetPeriod?.toLowerCase() ?? "week"}` : "not specified"}
`.trim();

  return `You are a nutrition planner for Dr Foods, a Nigerian food-lifestyle app. Build a 7-day meal plan (breakfast, lunch, dinner, and an optional snack per day) for this user, using ONLY dishes from the food list below — never invent a dish name. Respect allergies and medical conditions strictly (e.g. exclude anything conflicting with a hypertension or diabetes diagnosis by favoring lower-fat, lower-sodium, lower-sugar options where possible). Vary the dishes across the week rather than repeating the same one daily.

User profile:
${profileSummary}

Available foods:
${foodList}`;
}

async function generateWithClaude(profile: PlanProfile, availableFoods: FoodItem[]): Promise<AiPlanResult> {
  const client = getClaudeClient();

  const message = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    tools: [{ name: TOOL_NAME, description: TOOL_DESCRIPTION, input_schema: MEAL_PLAN_SCHEMA }],
    tool_choice: { type: "tool", name: TOOL_NAME },
    messages: [{ role: "user", content: buildPrompt(profile, availableFoods) }],
  });

  const toolUse = message.content.find(
    (block): block is Extract<typeof block, { type: "tool_use" }> => block.type === "tool_use"
  );

  if (!toolUse) {
    throw new Error("Claude did not return a structured meal plan");
  }

  return toolUse.input as AiPlanResult;
}

async function generateWithGroq(profile: PlanProfile, availableFoods: FoodItem[]): Promise<AiPlanResult> {
  const client = getGroqClient();

  const completion = await client.chat.completions.create({
    model: GROQ_MODEL,
    max_tokens: 4096,
    tools: [{ type: "function", function: { name: TOOL_NAME, description: TOOL_DESCRIPTION, parameters: MEAL_PLAN_SCHEMA } }],
    tool_choice: { type: "function", function: { name: TOOL_NAME } },
    messages: [{ role: "user", content: buildPrompt(profile, availableFoods) }],
  });

  const toolCall = completion.choices[0]?.message.tool_calls?.[0];
  if (!toolCall) {
    throw new Error("Groq did not return a structured meal plan");
  }

  return JSON.parse(toolCall.function.arguments) as AiPlanResult;
}

export async function generateAiMealPlan(profile: PlanProfile, availableFoods: FoodItem[]): Promise<AiPlanResult> {
  return env.AI_PROVIDER === "groq"
    ? generateWithGroq(profile, availableFoods)
    : generateWithClaude(profile, availableFoods);
}
