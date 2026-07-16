import { getClaudeClient, CLAUDE_MODEL } from "../../lib/claude";
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

const MEAL_PLAN_TOOL = {
  name: "create_meal_plan",
  description: "Return a structured 7-day Nigerian meal plan built only from the provided food list.",
  input_schema: {
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
  },
};

export async function generateAiMealPlan(
  profile: PlanProfile,
  availableFoods: FoodItem[]
): Promise<AiPlanResult> {
  const client = getClaudeClient();

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

  const message = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    tools: [MEAL_PLAN_TOOL],
    tool_choice: { type: "tool", name: "create_meal_plan" },
    messages: [
      {
        role: "user",
        content: `You are a nutrition planner for Dr Foods, a Nigerian food-lifestyle app. Build a 7-day meal plan (breakfast, lunch, dinner, and an optional snack per day) for this user, using ONLY dishes from the food list below — never invent a dish name. Respect allergies and medical conditions strictly (e.g. exclude anything conflicting with a hypertension or diabetes diagnosis by favoring lower-fat, lower-sodium, lower-sugar options where possible). Vary the dishes across the week rather than repeating the same one daily.

User profile:
${profileSummary}

Available foods:
${foodList}`,
      },
    ],
  });

  const toolUse = message.content.find(
    (block): block is Extract<typeof block, { type: "tool_use" }> => block.type === "tool_use"
  );

  if (!toolUse) {
    throw new Error("Claude did not return a structured meal plan");
  }

  return toolUse.input as AiPlanResult;
}
