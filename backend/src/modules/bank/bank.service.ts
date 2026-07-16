import { randomUUID } from "node:crypto";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../lib/http-error";
import type { AddCartItemInput, CheckoutInput } from "./bank.schemas";

const FLAT_DELIVERY_FEE = 1500;

export async function listProducts(category?: string) {
  return prisma.product.findMany({
    where: category ? { category: category as never } : undefined,
    orderBy: { name: "asc" },
  });
}

export async function getProduct(productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw HttpError.notFound("Product not found");
  return product;
}

export async function getCart(userId: string) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });
  const subtotal = items.reduce((sum, item) => sum + Number(item.product.pricePerUnit) * item.quantity, 0);
  return { items, subtotal, deliveryFee: items.length > 0 ? FLAT_DELIVERY_FEE : 0, total: subtotal + (items.length > 0 ? FLAT_DELIVERY_FEE : 0) };
}

export async function addToCart(userId: string, input: AddCartItemInput) {
  await getProduct(input.productId);
  return prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId: input.productId } },
    update: { quantity: { increment: input.quantity } },
    create: { userId, productId: input.productId, quantity: input.quantity },
    include: { product: true },
  });
}

export async function updateCartItem(userId: string, productId: string, quantity: number) {
  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({ where: { userId, productId } });
    return null;
  }
  return prisma.cartItem.update({
    where: { userId_productId: { userId, productId } },
    data: { quantity },
    include: { product: true },
  });
}

export async function removeCartItem(userId: string, productId: string) {
  await prisma.cartItem.deleteMany({ where: { userId, productId } });
}

export async function checkout(userId: string, input: CheckoutInput) {
  const cart = await getCart(userId);
  if (cart.items.length === 0) {
    throw HttpError.badRequest("Your cart is empty");
  }

  const order = await prisma.order.create({
    data: {
      userId,
      orderType: input.orderType,
      deliveryDate: input.deliveryDate,
      deliveryWindow: input.deliveryWindow,
      deliveryAddress: input.deliveryAddress,
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      total: cart.total,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.product.pricePerUnit,
          lineTotal: Number(item.product.pricePerUnit) * item.quantity,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  const payment = await prisma.payment.create({
    data: {
      userId,
      orderId: order.id,
      provider: "MOCK",
      amount: cart.total,
      status: "PENDING",
      reference: `mock_${randomUUID()}`,
    },
  });

  await prisma.cartItem.deleteMany({ where: { userId } });

  return { order, payment };
}

// Sandbox-only helper: confirms a MOCK payment without a live Paystack/Flutterwave key.
// Swap for a real webhook handler in payments.service.ts once live keys are configured.
export async function mockConfirmPayment(userId: string, paymentId: string) {
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment || payment.userId !== userId) {
    throw HttpError.notFound("Payment not found");
  }
  if (payment.status !== "PENDING") {
    throw HttpError.badRequest("Payment already processed");
  }

  const [updatedPayment] = await prisma.$transaction([
    prisma.payment.update({ where: { id: paymentId }, data: { status: "SUCCESS" } }),
    prisma.order.update({ where: { id: payment.orderId! }, data: { status: "CONFIRMED" } }),
  ]);

  return updatedPayment;
}

export async function listOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });
}

export async function getOrder(userId: string, orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } }, payments: true },
  });
  if (!order || order.userId !== userId) {
    throw HttpError.notFound("Order not found");
  }
  return order;
}
