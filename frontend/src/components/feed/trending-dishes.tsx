"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useFoodItems } from "@/hooks/use-nutrition";

export function TrendingDishes() {
  const { data: foods, isLoading } = useFoodItems();
  const dishes = foods?.filter((f) => f.imageUrl).slice(0, 10) ?? [];

  if (isLoading) {
    return (
      <div className="flex h-28 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (dishes.length === 0) return null;

  return (
    <div>
      <h2 className="mb-2 font-display text-sm font-semibold text-muted-foreground">Popular Nigerian dishes</h2>
      <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0">
        {dishes.map((dish) => (
          <div key={dish.id} className="flex w-20 shrink-0 flex-col items-center gap-1.5 text-center">
            <div className="relative size-20 overflow-hidden rounded-full border-2 border-primary/15 bg-muted">
              <Image src={dish.imageUrl!} alt={dish.name} fill sizes="80px" className="object-cover" />
            </div>
            <span className="line-clamp-2 text-[11px] font-medium leading-tight text-foreground">{dish.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
