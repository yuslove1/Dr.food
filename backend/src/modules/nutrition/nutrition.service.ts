import { prisma } from "../../lib/prisma";
import { HttpError } from "../../lib/http-error";
import { convertQuantity } from "../../lib/unit-convert";
import { generateAiMealPlan } from "./nutrition.ai";
import type { GeneratePlanInput, LogMealInput } from "./nutrition.schemas";

const DAY_MS = 24 * 60 * 60 * 1000;

export async function listFoodItems() {
  return prisma.foodItem.findMany({ orderBy: { name: "asc" } });
}

async function resolveProfile(userId: string, familyMemberId?: string) {
  if (familyMemberId) {
    const member = await prisma.familyMember.findUnique({ where: { id: familyMemberId } });
    if (!member || member.userId !== userId) {
      throw HttpError.notFound("Family member not found");
    }
    return {
      age: member.age,
      gender: member.gender,
      activityLevel: "MODERATE",
      goals: [] as string[],
      medicalConditions: member.medicalConditions,
      dietaryRestrictions: member.dietaryRestrictions,
      allergies: member.allergies,
      budgetAmount: null,
      budgetPeriod: null,
    };
  }

  const profile = await prisma.healthProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw HttpError.badRequest("Complete your health profile before generating a meal plan");
  }
  return {
    age: profile.age,
    gender: profile.gender,
    activityLevel: profile.activityLevel,
    goals: profile.goals,
    medicalConditions: profile.medicalConditions,
    dietaryRestrictions: profile.dietaryRestrictions,
    allergies: profile.allergies,
    budgetAmount: profile.budgetAmount ? Number(profile.budgetAmount) : null,
    budgetPeriod: profile.budgetPeriod,
  };
}

export async function generateMealPlan(userId: string, input: GeneratePlanInput) {
  const profile = await resolveProfile(userId, input.familyMemberId);
  const foodItems = await prisma.foodItem.findMany();

  if (foodItems.length === 0) {
    throw HttpError.badRequest("No food items available — run the database seed first");
  }

  let aiPlan;
  try {
    aiPlan = await generateAiMealPlan(profile, foodItems);
  } catch (err) {
    if (err instanceof Error && err.message.includes("ANTHROPIC_API_KEY")) {
      throw new HttpError(503, "AI meal plan generation isn't configured yet — set ANTHROPIC_API_KEY in backend/.env");
    }
    throw err;
  }
  const foodItemByName = new Map(foodItems.map((f) => [f.name.toLowerCase(), f]));

  const startDate = new Date();
  const durationDays = input.type === "MONTHLY" ? 28 : 7;
  const endDate = new Date(startDate.getTime() + durationDays * DAY_MS);

  const entriesData = aiPlan.days.flatMap((day) =>
    day.meals
      .map((meal) => {
        const foodItem = foodItemByName.get(meal.foodName.toLowerCase());
        if (!foodItem) return null;
        return {
          dayOfWeek: day.dayOfWeek,
          mealType: meal.mealType,
          foodItemId: foodItem.id,
          servings: meal.servings,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
  );

  if (entriesData.length === 0) {
    throw new Error("AI meal plan did not match any known food items");
  }

  const mealPlan = await prisma.mealPlan.create({
    data: {
      userId,
      familyMemberId: input.familyMemberId,
      type: input.type,
      startDate,
      endDate,
      generatedBy: "AI",
      entries: { create: entriesData },
    },
    include: { entries: { include: { foodItem: true } } },
  });

  const shoppingList = await buildShoppingList(userId, mealPlan.id, input.type === "MONTHLY" ? 4 : 1);

  await prisma.mealPlan.update({
    where: { id: mealPlan.id },
    data: { totalEstimatedCost: shoppingList.estimatedCost ?? undefined },
  });

  return { ...mealPlan, shoppingList };
}

async function buildShoppingList(userId: string, mealPlanId: string, weeksMultiplier: number) {
  const entries = await prisma.mealPlanEntry.findMany({
    where: { mealPlanId },
    include: { foodItem: { include: { ingredients: { include: { product: true } } } } },
  });

  const aggregated = new Map<
    string,
    { name: string; unit: string; quantity: number; productId: string | null; pricePerUnit: number | null; productUnit: string | null }
  >();

  for (const entry of entries) {
    for (const ingredient of entry.foodItem.ingredients) {
      const key = `${ingredient.name}::${ingredient.unit}`;
      const addQty = ingredient.quantityPerServing * entry.servings * weeksMultiplier;
      const existing = aggregated.get(key);
      if (existing) {
        existing.quantity += addQty;
      } else {
        aggregated.set(key, {
          name: ingredient.name,
          unit: ingredient.unit,
          quantity: addQty,
          productId: ingredient.productId,
          pricePerUnit: ingredient.product ? Number(ingredient.product.pricePerUnit) : null,
          productUnit: ingredient.product?.unit ?? null,
        });
      }
    }
  }

  const items = Array.from(aggregated.values()).map((item) => {
    const estimatedPrice =
      item.pricePerUnit !== null && item.productUnit
        ? convertQuantity(item.quantity, item.unit, item.productUnit) * item.pricePerUnit
        : null;
    return {
      ingredientName: item.name,
      quantity: Math.round(item.quantity * 100) / 100,
      unit: item.unit,
      productId: item.productId,
      estimatedPrice: estimatedPrice !== null ? Math.round(estimatedPrice) : null,
    };
  });

  const estimatedCost = items.reduce((sum, item) => sum + (item.estimatedPrice ?? 0), 0);

  const existing = await prisma.shoppingList.findUnique({ where: { mealPlanId } });
  if (existing) {
    await prisma.shoppingListItem.deleteMany({ where: { shoppingListId: existing.id } });
    return prisma.shoppingList.update({
      where: { id: existing.id },
      data: { estimatedCost, items: { create: items } },
      include: { items: { include: { product: true } } },
    });
  }

  return prisma.shoppingList.create({
    data: { mealPlanId, userId, estimatedCost, items: { create: items } },
    include: { items: { include: { product: true } } },
  });
}

export async function listMealPlans(userId: string) {
  return prisma.mealPlan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { shoppingList: true, familyMember: true },
  });
}

export async function getMealPlan(userId: string, planId: string) {
  const plan = await prisma.mealPlan.findUnique({
    where: { id: planId },
    include: {
      entries: { include: { foodItem: true }, orderBy: [{ dayOfWeek: "asc" }] },
      shoppingList: { include: { items: { include: { product: true } } } },
      familyMember: true,
    },
  });
  if (!plan || plan.userId !== userId) {
    throw HttpError.notFound("Meal plan not found");
  }
  return plan;
}

export async function sendShoppingListToCart(userId: string, shoppingListId: string) {
  const list = await prisma.shoppingList.findUnique({
    where: { id: shoppingListId },
    include: { items: true },
  });
  if (!list || list.userId !== userId) {
    throw HttpError.notFound("Shopping list not found");
  }

  for (const item of list.items) {
    if (!item.productId) continue;
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) continue;
    const quantity = Math.max(1, Math.ceil(convertQuantity(item.quantity, item.unit, product.unit)));

    await prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId: item.productId } },
      update: { quantity },
      create: { userId, productId: item.productId, quantity },
    });
  }

  return prisma.shoppingList.update({
    where: { id: shoppingListId },
    data: { status: "SENT_TO_CART" },
  });
}

export async function logMeal(userId: string, input: LogMealInput) {
  return prisma.mealLog.create({ data: { userId, ...input } });
}

export async function listMealLogs(userId: string) {
  return prisma.mealLog.findMany({ where: { userId }, orderBy: { date: "desc" }, include: { foodItem: true } });
}
