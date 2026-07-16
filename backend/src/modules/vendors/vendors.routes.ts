import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../lib/async-handler";
import { requireAuth, type AuthenticatedRequest } from "../../middleware/auth";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../lib/http-error";

// Scaffold only — vetting workflow, order management, and vendor analytics are a future
// pass (see plan: "Vendor & Home Cook Storefronts" is schema + thin routes for this build).
export const vendorsRouter = Router();

vendorsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const vendors = await prisma.vendor.findMany({
      where: { status: "APPROVED" },
      include: { listings: { where: { available: true } } },
    });
    res.json(vendors);
  })
);

vendorsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const vendor = await prisma.vendor.findUnique({
      where: { id: req.params.id },
      include: { listings: true },
    });
    if (!vendor) throw HttpError.notFound("Vendor not found");
    res.json(vendor);
  })
);

const applySchema = z.object({
  businessName: z.string().min(2),
  type: z.enum(["HOME_KITCHEN", "REGISTERED_RESTAURANT"]).default("HOME_KITCHEN"),
  deliveryRadiusKm: z.number().positive().optional(),
});

vendorsRouter.post(
  "/apply",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = applySchema.parse(req.body);
    const vendor = await prisma.vendor.create({
      data: { userId: req.user!.id, ...input },
    });
    res.status(201).json(vendor);
  })
);
