"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useCart, useCheckout, useMockConfirmPayment } from "@/hooks/use-bank";
import { useHealthProfile } from "@/hooks/use-profile";
import { formatNaira } from "@/lib/utils";
import { ApiError } from "@/lib/api";

const DELIVERY_WINDOWS = ["8am - 11am", "11am - 2pm", "2pm - 5pm", "5pm - 8pm"];

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart } = useCart();
  const { data: profile } = useHealthProfile();
  const checkout = useCheckout();
  const mockConfirm = useMockConfirmPayment();

  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryWindow, setDeliveryWindow] = useState(DELIVERY_WINDOWS[0]);
  const [deliveryAddress, setDeliveryAddress] = useState(profile?.address ?? "");
  const [orderType, setOrderType] = useState("ONE_TIME");

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { order, payment } = await checkout.mutateAsync({
        orderType,
        deliveryDate,
        deliveryWindow,
        deliveryAddress,
      });
      await mockConfirm.mutateAsync(payment.id);
      toast.success("Order placed and payment confirmed!");
      router.replace(`/bank/orders/${order.id}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not place order");
    }
  }

  const submitting = checkout.isPending || mockConfirm.isPending;

  return (
    <div className="flex flex-col gap-5 py-4">
      <Link href="/bank/cart" className="flex items-center gap-1 text-sm text-muted-foreground">
        <ChevronLeft className="size-4" /> Back to cart
      </Link>

      <h1 className="font-display text-2xl font-bold">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <Label>Order type</Label>
          <Select value={orderType} onValueChange={setOrderType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ONE_TIME">One-time order</SelectItem>
              <SelectItem value="WEEKLY_SUBSCRIPTION">Weekly subscription</SelectItem>
              <SelectItem value="MONTHLY_BULK">Monthly bulk</SelectItem>
              <SelectItem value="CONDITION_SPECIFIC">Condition-specific box</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="date">Delivery date</Label>
          <Input
            id="date"
            type="date"
            required
            min={new Date().toISOString().slice(0, 10)}
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Delivery window</Label>
          <Select value={deliveryWindow} onValueChange={setDeliveryWindow}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DELIVERY_WINDOWS.map((w) => (
                <SelectItem key={w} value={w}>
                  {w}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address">Delivery address</Label>
          <Textarea
            id="address"
            required
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Street, area, landmark"
          />
        </div>

        {cart && (
          <Card>
            <CardContent className="flex justify-between p-4 text-sm">
              <span className="text-muted-foreground">Total ({cart.items.length} items)</span>
              <span className="font-semibold">{formatNaira(cart.total)}</span>
            </CardContent>
          </Card>
        )}

        <Button type="submit" size="lg" disabled={submitting || !cart?.items.length}>
          {submitting && <Loader2 className="animate-spin" />}
          Place order
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Payment is simulated for this build — no live Paystack charge occurs.
        </p>
      </form>
    </div>
  );
}
