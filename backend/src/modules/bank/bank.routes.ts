import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler";
import { requireAuth, type AuthenticatedRequest } from "../../middleware/auth";
import { addCartItemSchema, checkoutSchema, updateCartItemSchema } from "./bank.schemas";
import * as bankService from "./bank.service";

export const bankRouter = Router();

bankRouter.get(
  "/products",
  asyncHandler(async (req, res) => {
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    res.json(await bankService.listProducts(category));
  })
);

bankRouter.get(
  "/products/:productId",
  asyncHandler(async (req, res) => {
    res.json(await bankService.getProduct(req.params.productId));
  })
);

bankRouter.use(requireAuth);

bankRouter.get(
  "/cart",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    res.json(await bankService.getCart(req.user!.id));
  })
);

bankRouter.post(
  "/cart/items",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = addCartItemSchema.parse(req.body);
    res.status(201).json(await bankService.addToCart(req.user!.id, input));
  })
);

bankRouter.put(
  "/cart/items/:productId",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = updateCartItemSchema.parse(req.body);
    const result = await bankService.updateCartItem(req.user!.id, req.params.productId, input.quantity);
    res.json(result);
  })
);

bankRouter.delete(
  "/cart/items/:productId",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    await bankService.removeCartItem(req.user!.id, req.params.productId);
    res.status(204).send();
  })
);

bankRouter.post(
  "/checkout",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const input = checkoutSchema.parse(req.body);
    const result = await bankService.checkout(req.user!.id, input);
    res.status(201).json(result);
  })
);

bankRouter.post(
  "/payments/:paymentId/mock-confirm",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const payment = await bankService.mockConfirmPayment(req.user!.id, req.params.paymentId);
    res.json(payment);
  })
);

bankRouter.get(
  "/orders",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    res.json(await bankService.listOrders(req.user!.id));
  })
);

bankRouter.get(
  "/orders/:orderId",
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    res.json(await bankService.getOrder(req.user!.id, req.params.orderId));
  })
);
