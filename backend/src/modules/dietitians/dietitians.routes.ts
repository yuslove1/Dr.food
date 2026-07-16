import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../lib/async-handler";
import { requireAuth, type AuthenticatedRequest } from "../../middleware/auth";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../lib/http-error";

// Scaffold only — full booking/payout/messaging/video-consultation flow is a future pass
// (see plan: "Dietitian Marketplace" is schema + thin routes for this build).
export const dietitiansRouter = Router();

dietitiansRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const dietitians = await prisma.dietitianProfile.findMany({
      include: { user: { select: { id: true, fullName: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(dietitians);
  })
);

dietitiansRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const dietitian = await prisma.dietitianProfile.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { id: true, fullName: true } } },
    });
    if (!dietitian) throw HttpError.notFound("Dietitian not found");
    res.json(dietitian);
  })
);

const bookingSchema = z.object({
  dietitianProfileId: z.string(),
  consultationType: z.enum(["ONE_TIME", "MONTHLY_SUBSCRIPTION", "PLAN_REVIEW"]).default("ONE_TIME"),
  scheduledAt: z.coerce.date(),
});

dietitiansRouter.post(
  "/bookings",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = bookingSchema.parse(req.body);
    const dietitian = await prisma.dietitianProfile.findUnique({ where: { id: input.dietitianProfileId } });
    if (!dietitian) throw HttpError.notFound("Dietitian not found");

    const booking = await prisma.booking.create({
      data: {
        userId: req.user!.id,
        dietitianProfileId: input.dietitianProfileId,
        consultationType: input.consultationType,
        scheduledAt: input.scheduledAt,
        price: dietitian.pricePerSession,
      },
    });
    res.status(201).json(booking);
  })
);

dietitiansRouter.get(
  "/bookings/me",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user!.id },
      include: { dietitianProfile: { include: { user: { select: { fullName: true } } } } },
      orderBy: { scheduledAt: "desc" },
    });
    res.json(bookings);
  })
);
