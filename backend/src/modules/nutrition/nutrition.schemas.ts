import { z } from "zod";

export const generatePlanSchema = z.object({
  familyMemberId: z.string().optional(),
  type: z.enum(["WEEKLY", "MONTHLY"]).default("WEEKLY"),
});

export const logMealSchema = z.object({
  date: z.coerce.date(),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]),
  foodItemId: z.string().optional(),
  eaten: z.boolean().default(true),
  notes: z.string().optional(),
});

export type GeneratePlanInput = z.infer<typeof generatePlanSchema>;
export type LogMealInput = z.infer<typeof logMealSchema>;
