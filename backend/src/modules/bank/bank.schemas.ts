import { z } from "zod";

export const addCartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive().default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0),
});

export const checkoutSchema = z.object({
  orderType: z.enum(["ONE_TIME", "WEEKLY_SUBSCRIPTION", "MONTHLY_BULK", "CONDITION_SPECIFIC"]).default("ONE_TIME"),
  deliveryDate: z.coerce.date(),
  deliveryWindow: z.string().min(1),
  deliveryAddress: z.string().min(3),
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
