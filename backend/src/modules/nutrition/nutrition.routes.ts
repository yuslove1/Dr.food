import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler";
import { requireAuth, type AuthenticatedRequest } from "../../middleware/auth";
import { generatePlanSchema, logMealSchema } from "./nutrition.schemas";
import * as nutritionService from "./nutrition.service";

export const nutritionRouter = Router();
nutritionRouter.use(requireAuth);

nutritionRouter.get(
  "/foods",
  asyncHandler(async (_req, res) => {
    res.json(await nutritionService.listFoodItems());
  })
);

nutritionRouter.get(
  "/plans",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    res.json(await nutritionService.listMealPlans(req.user!.id));
  })
);

nutritionRouter.get(
  "/plans/:planId",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    res.json(await nutritionService.getMealPlan(req.user!.id, req.params.planId));
  })
);

nutritionRouter.post(
  "/plans/generate",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = generatePlanSchema.parse(req.body);
    const plan = await nutritionService.generateMealPlan(req.user!.id, input);
    res.status(201).json(plan);
  })
);

nutritionRouter.post(
  "/shopping-lists/:shoppingListId/send-to-cart",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const list = await nutritionService.sendShoppingListToCart(req.user!.id, req.params.shoppingListId);
    res.json(list);
  })
);

nutritionRouter.get(
  "/logs",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    res.json(await nutritionService.listMealLogs(req.user!.id));
  })
);

nutritionRouter.post(
  "/logs",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = logMealSchema.parse(req.body);
    const log = await nutritionService.logMeal(req.user!.id, input);
    res.status(201).json(log);
  })
);
