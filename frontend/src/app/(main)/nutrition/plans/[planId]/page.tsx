"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft, Loader2, ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useMealPlan, useSendShoppingListToCart } from "@/hooks/use-nutrition";
import { ApiError } from "@/lib/api";
import { formatNaira } from "@/lib/utils";
import type { MealPlanEntry, MealType } from "@/types/api";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MEAL_ORDER: MealType[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

export default function MealPlanDetailPage({ params }: { params: Promise<{ planId: string }> }) {
  const { planId } = use(params);
  const { data: plan, isLoading } = useMealPlan(planId);
  const sendToCart = useSendShoppingListToCart();
  const [activeDay, setActiveDay] = useState("0");

  async function handleSendToCart() {
    if (!plan?.shoppingList) return;
    try {
      await sendToCart.mutateAsync(plan.shoppingList.id);
      toast.success("Ingredients added to your Dr Foods Bank cart");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not send to cart");
    }
  }

  if (isLoading || !plan) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const entriesByDay = new Map<number, MealPlanEntry[]>();
  for (const entry of plan.entries) {
    const list = entriesByDay.get(entry.dayOfWeek) ?? [];
    list.push(entry);
    entriesByDay.set(entry.dayOfWeek, list);
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      <Link href="/nutrition" className="flex items-center gap-1 text-sm text-muted-foreground">
        <ChevronLeft className="size-4" /> All plans
      </Link>

      <div>
        <h1 className="font-display text-2xl font-bold">{plan.type === "WEEKLY" ? "Weekly" : "Monthly"} plan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {new Date(plan.startDate).toLocaleDateString("en-NG", { month: "short", day: "numeric" })} –{" "}
          {new Date(plan.endDate).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
        </p>
      </div>

      <Tabs value={activeDay} onValueChange={setActiveDay}>
        <TabsList className="w-full justify-between overflow-x-auto">
          {DAY_LABELS.map((label, idx) => (
            <TabsTrigger key={idx} value={String(idx)} className="flex-1">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {DAY_LABELS.map((_, idx) => (
          <TabsContent key={idx} value={String(idx)} className="flex flex-col gap-3">
            {MEAL_ORDER.map((mealType) => {
              const entry = (entriesByDay.get(idx) ?? []).find((e) => e.mealType === mealType);
              if (!entry) return null;
              return (
                <Card key={mealType} className="overflow-hidden">
                  <CardContent className="flex items-center gap-3 p-4">
                    {entry.foodItem.imageUrl && (
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                        <Image src={entry.foodItem.imageUrl} alt={entry.foodItem.name} fill sizes="56px" className="object-cover" />
                      </div>
                    )}
                    <div>
                      <Badge variant="muted" className="mb-1.5">
                        {mealType[0] + mealType.slice(1).toLowerCase()}
                      </Badge>
                      <p className="text-sm font-semibold">{entry.foodItem.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(entry.foodItem.caloriesPer100g * entry.servings)} kcal · {entry.servings} serving
                        {entry.servings !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        ))}
      </Tabs>

      {plan.shoppingList && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold">Shopping list</h2>
              {plan.shoppingList.estimatedCost && (
                <span className="text-sm font-semibold">{formatNaira(plan.shoppingList.estimatedCost)}</span>
              )}
            </div>
            <Separator className="my-3" />
            <ul className="flex flex-col gap-2">
              {plan.shoppingList.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between text-sm">
                  <span>{item.ingredientName}</span>
                  <span className="text-muted-foreground">
                    {item.quantity}
                    {item.unit}
                  </span>
                </li>
              ))}
            </ul>
            <Button
              className="mt-4 w-full"
              disabled={sendToCart.isPending || plan.shoppingList.status === "SENT_TO_CART"}
              onClick={handleSendToCart}
            >
              {sendToCart.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ShoppingBasket />
              )}
              {plan.shoppingList.status === "SENT_TO_CART" ? "Already in cart" : "Send ingredients to cart"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
