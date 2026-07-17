"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { CalendarDays, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon3D } from "@/components/icon-3d";
import { useGenerateMealPlan, useMealPlans } from "@/hooks/use-nutrition";
import { ApiError } from "@/lib/api";
import { formatNaira } from "@/lib/utils";

export default function NutritionPage() {
  const { data: plans, isLoading } = useMealPlans();
  const generatePlan = useGenerateMealPlan();
  const [generatingType, setGeneratingType] = useState<"WEEKLY" | "MONTHLY" | null>(null);

  async function handleGenerate(type: "WEEKLY" | "MONTHLY") {
    setGeneratingType(type);
    try {
      const plan = await generatePlan.mutateAsync({ type });
      toast.success("Your AI meal plan is ready!");
      window.location.href = `/nutrition/plans/${plan.id}`;
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not generate a plan right now");
    } finally {
      setGeneratingType(null);
    }
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="font-display text-2xl font-bold">Nutrition</h1>
        <p className="mt-1 text-sm text-muted-foreground">AI-built Nigerian meal plans, tailored to you.</p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-center gap-3">
            <Icon3D name="sparkles" size={40} />
            <div>
              <p className="font-display text-sm font-semibold">Generate a new plan</p>
              <p className="text-xs text-muted-foreground">Built from your health profile</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" disabled={generatePlan.isPending} onClick={() => handleGenerate("WEEKLY")}>
              {generatingType === "WEEKLY" && <Loader2 className="animate-spin" />}
              Weekly plan
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              disabled={generatePlan.isPending}
              onClick={() => handleGenerate("MONTHLY")}
            >
              {generatingType === "MONTHLY" && <Loader2 className="animate-spin" />}
              Monthly plan
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-sm font-semibold text-muted-foreground">Your plans</h2>

        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && plans?.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
              <Icon3D name="pot-of-food" size={56} />
              <p className="text-sm text-muted-foreground">No meal plans yet — generate your first one above.</p>
            </CardContent>
          </Card>
        )}

        {plans?.map((plan) => (
          <Link key={plan.id} href={`/nutrition/plans/${plan.id}`}>
            <Card className="transition-colors hover:border-primary/40">
              <CardContent className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
                    <CalendarDays className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{plan.type === "WEEKLY" ? "Weekly plan" : "Monthly plan"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(plan.startDate).toLocaleDateString("en-NG", { month: "short", day: "numeric" })} –{" "}
                      {new Date(plan.endDate).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {plan.totalEstimatedCost && (
                    <p className="text-sm font-semibold">{formatNaira(plan.totalEstimatedCost)}</p>
                  )}
                  <Badge variant={plan.status === "ACTIVE" ? "default" : "muted"}>{plan.status}</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
