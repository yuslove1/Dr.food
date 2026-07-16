"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Salad, ShoppingBasket, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading || !user) return;
    router.replace(user.onboardingComplete ? "/feed" : "/onboarding");
  }, [loading, user, router]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-10">
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Leaf className="size-5" />
        </span>
        <span className="font-display text-lg font-bold tracking-tight">Dr Foods</span>
      </div>

      <div className="mt-14 flex flex-1 flex-col justify-center gap-8">
        <div className="space-y-3">
          <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-balance">
            Eat better, plan smarter.
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground text-balance">
            AI-powered Nigerian meal plans, verified dietitians, and fresh ingredients delivered — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <FeatureChip icon={Salad} label="AI meal plans" />
          <FeatureChip icon={ShoppingBasket} label="Grocery delivery" />
          <FeatureChip icon={Stethoscope} label="Dietitians" />
        </div>

        <div className="flex flex-col gap-3">
          <Button asChild size="lg">
            <Link href="/signup">Get started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">I already have an account</Link>
          </Button>
        </div>
      </div>

      <p className="pt-6 text-center text-xs text-muted-foreground">
        Dr Foods — a product of Entechnologue World. Lagos, Nigeria.
      </p>
    </div>
  );
}

function FeatureChip({ icon: Icon, label }: { icon: typeof Salad; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center">
      <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary">
        <Icon className="size-4" />
      </span>
      <span className="text-[11px] font-medium leading-tight text-muted-foreground">{label}</span>
    </div>
  );
}
