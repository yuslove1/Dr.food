import { z } from "zod";

export const healthProfileSchema = z.object({
  age: z.number().int().min(1).max(120).optional(),
  gender: z.string().optional(),
  heightCm: z.number().positive().optional(),
  weightKg: z.number().positive().optional(),
  activityLevel: z.enum(["SEDENTARY", "LIGHT", "MODERATE", "ACTIVE", "VERY_ACTIVE"]).optional(),
  goals: z.array(z.string()).optional(),
  medicalConditions: z.array(z.string()).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  budgetAmount: z.number().nonnegative().optional(),
  budgetPeriod: z.enum(["WEEKLY", "MONTHLY"]).optional(),
  deliveryZone: z.enum(["LEKKI", "VICTORIA_ISLAND", "IKEJA", "YABA", "SURULERE", "OTHER"]).optional(),
  address: z.string().optional(),
});

export const familyMemberSchema = z.object({
  name: z.string().min(1),
  relationship: z.string().min(1),
  age: z.number().int().min(0).max(120).optional(),
  gender: z.string().optional(),
  heightCm: z.number().positive().optional(),
  weightKg: z.number().positive().optional(),
  medicalConditions: z.array(z.string()).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
});

export type HealthProfileInput = z.infer<typeof healthProfileSchema>;
export type FamilyMemberInput = z.infer<typeof familyMemberSchema>;
