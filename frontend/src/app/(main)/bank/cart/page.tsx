"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Loader2, Minus, Plus, ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart, useUpdateCartItem } from "@/hooks/use-bank";
import { categoryImage } from "@/lib/category-images";
import { formatNaira } from "@/lib/utils";

export default function CartPage() {
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();

  if (isLoading || !cart) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 py-4">
      <Link href="/bank" className="flex items-center gap-1 text-sm text-muted-foreground">
        <ChevronLeft className="size-4" /> Continue shopping
      </Link>

      <h1 className="font-display text-2xl font-bold">Your cart</h1>

      {cart.items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 p-10 text-center">
            <ShoppingBasket className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            <Button asChild size="sm" className="mt-2">
              <Link href="/bank">Browse Dr Foods Bank</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {cart.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex items-center gap-3 p-3">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={item.product.imageUrl || categoryImage(item.product.category)}
                      alt={item.product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatNaira(item.product.pricePerUnit)} / {item.product.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-7 rounded-full"
                      onClick={() => updateItem.mutate({ productId: item.productId, quantity: item.quantity - 1 })}
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="size-7 rounded-full"
                      onClick={() => updateItem.mutate({ productId: item.productId, quantity: item.quantity + 1 })}
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="flex flex-col gap-2 p-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatNaira(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery fee</span>
                <span>{formatNaira(cart.deliveryFee)}</span>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatNaira(cart.total)}</span>
              </div>
              <Button asChild size="lg" className="mt-3">
                <Link href="/bank/checkout">Proceed to checkout</Link>
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
