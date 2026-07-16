import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../../middleware/auth";
import { asyncHandler } from "../../lib/async-handler";
import { prisma } from "../../lib/prisma";

// Scaffold only — live Paystack webhook verification is a future pass once
// PAYSTACK_SECRET_KEY is configured (see paystack.service.ts).
export const paymentsRouter = Router();

paymentsRouter.get(
  "/wallet",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const wallet = await prisma.wallet.findUnique({ where: { userId: req.user!.id } });
    res.json(wallet);
  })
);

paymentsRouter.post("/webhook/paystack", (_req, res) => {
  // TODO: verify Paystack signature and reconcile Payment/Order status once live keys exist.
  res.status(200).json({ received: true });
});
