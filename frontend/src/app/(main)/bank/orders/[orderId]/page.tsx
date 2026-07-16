"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft, Clock, Loader2, MapPin, PackageCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOrder } from "@/hooks/use-bank";
import { formatNaira } from "@/lib/utils";

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading || !order) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 py-4">
      <Link href="/bank/orders" className="flex items-center gap-1 text-sm text-muted-foreground">
        <ChevronLeft className="size-4" /> All orders
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Order details</h1>
        <Badge>{order.status.replace("_", " ")}</Badge>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-2 p-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="size-4" />
            {new Date(order.deliveryDate).toLocaleDateString("en-NG", { month: "long", day: "numeric" })} ·{" "}
            {order.deliveryWindow}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4" />
            {order.deliveryAddress}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        {order.items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{item.product.name}</p>
                <p className="text-sm">{formatNaira(item.lineTotal)}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {item.quantity} x {formatNaira(item.unitPrice)}
              </p>

              {(item.product.storageMethod || item.product.prepInstructions) && (
                <div className="mt-3 rounded-xl bg-secondary p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <PackageCheck className="size-3.5" />
                    Preservation & processing guide
                  </div>
                  {item.product.storageMethod && (
                    <p className="text-xs text-muted-foreground">{item.product.storageMethod}</p>
                  )}
                  {item.product.prepInstructions && (
                    <p className="mt-1 text-xs text-muted-foreground">{item.product.prepInstructions}</p>
                  )}
                  {item.product.shelfLifeDays && (
                    <p className="mt-1 text-xs font-medium text-primary">
                      Best used within {item.product.shelfLifeDays} days
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="flex flex-col gap-2 p-5">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatNaira(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery fee</span>
            <span>{formatNaira(order.deliveryFee)}</span>
          </div>
          <Separator className="my-1" />
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatNaira(order.total)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
