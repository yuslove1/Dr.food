"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Plus, ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAddToCart, useCart, useProducts } from "@/hooks/use-bank";
import { categoryImage } from "@/lib/category-images";
import { formatNaira, cn } from "@/lib/utils";
import type { FoodCategory } from "@/types/api";

const CATEGORIES: { value: FoodCategory | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PROTEIN", label: "Protein" },
  { value: "GRAIN", label: "Grain" },
  { value: "VEGETABLE", label: "Vegetable" },
  { value: "FRUIT", label: "Fruit" },
  { value: "SPICE", label: "Spice" },
  { value: "PANTRY", label: "Pantry" },
];

export default function BankCatalogPage() {
  const [category, setCategory] = useState<string>("ALL");
  const { data: products, isLoading } = useProducts(category === "ALL" ? undefined : category);
  const { data: cart } = useCart();
  const addToCart = useAddToCart();

  async function handleAdd(productId: string) {
    try {
      await addToCart.mutateAsync({ productId, quantity: 1 });
      toast.success("Added to cart");
    } catch {
      toast.error("Could not add to cart");
    }
  }

  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Dr Foods Bank</h1>
          <p className="mt-1 text-sm text-muted-foreground">Fresh raw ingredients, delivered.</p>
        </div>
        <Link href="/bank/cart" className="relative">
          <Button variant="outline" size="icon">
            <ShoppingBasket className="size-4" />
          </Button>
          {cart && cart.items.length > 0 && (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
              {cart.items.length}
            </span>
          )}
        </Link>
      </div>

      <Tabs value={category} onValueChange={setCategory}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {CATEGORIES.map((c) => (
            <TabsTrigger key={c.value} value={c.value}>
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {products?.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative aspect-square w-full bg-muted">
              <Image
                src={product.imageUrl || categoryImage(product.category)}
                alt={product.name}
                fill
                sizes="(min-width: 768px) 260px, 200px"
                className="object-cover"
              />
            </div>
            <CardContent className="flex flex-col gap-1 p-3">
              <p className="line-clamp-1 text-sm font-semibold">{product.name}</p>
              <p className="text-xs text-muted-foreground">per {product.unit}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-sm font-bold">{formatNaira(product.pricePerUnit)}</span>
                <Button
                  size="icon"
                  className={cn("size-8 rounded-full")}
                  disabled={addToCart.isPending}
                  onClick={() => handleAdd(product.id)}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
