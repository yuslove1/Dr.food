import type { FoodCategory } from "@/types/api";

// Dr Foods Bank doesn't have commissioned per-SKU product photography yet, so the catalog
// falls back to a representative photo per category rather than a placeholder icon.
const CATEGORY_IMAGES: Partial<Record<FoodCategory, string>> = {
  PROTEIN: "/images/foods/category-protein.jpg",
  GRAIN: "/images/foods/category-grain.jpg",
  VEGETABLE: "/images/foods/category-vegetable.jpg",
  FRUIT: "/images/foods/category-fruit.jpg",
  SPICE: "/images/foods/category-spice.jpg",
  PANTRY: "/images/foods/category-pantry.jpg",
};

const FALLBACK_IMAGE = "/images/foods/category-pantry.jpg";

export function categoryImage(category: FoodCategory): string {
  return CATEGORY_IMAGES[category] ?? FALLBACK_IMAGE;
}
