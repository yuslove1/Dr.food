"use client";

import Link from "next/link";
import { Loader2, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOrders } from "@/hooks/use-bank";
import { formatNaira } from "@/lib/utils";

const STATUS_VARIANT: Record<string, "default" | "muted" | "accent" | "destructive"> = {
  PENDING_PAYMENT: "muted",
  CONFIRMED: "default",
  PACKED: "default",
  DISPATCHED: "accent",
  DELIVERED: "default",
  CANCELLED: "destructive",
};

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders();

  return (
    <div className="flex flex-col gap-5 py-4">
      <h1 className="font-display text-2xl font-bold">Your orders</h1>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && orders?.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 p-10 text-center">
            <Package className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {orders?.map((order) => (
          <Link key={order.id} href={`/bank/orders/${order.id}`}>
            <Card className="transition-colors hover:border-primary/40">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-semibold">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatNaira(order.total)}</p>
                  <Badge variant={STATUS_VARIANT[order.status] ?? "muted"}>{order.status.replace("_", " ")}</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
