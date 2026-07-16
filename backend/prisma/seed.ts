import { PrismaClient } from "@prisma/client";
import { products } from "./seed-data/products";
import { foods } from "./seed-data/foods";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Dr Foods Bank product catalog...");
  const productIdByName = new Map<string, string>();

  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { name: product.name },
      update: product,
      create: product,
    });
    productIdByName.set(product.name, created.id);
  }
  console.log(`  Seeded ${products.length} products.`);

  console.log("Seeding Nigerian food & nutrition dataset...");
  for (const food of foods) {
    const { ingredients, ...foodData } = food;

    const foodItem = await prisma.foodItem.upsert({
      where: { name: food.name },
      update: foodData,
      create: foodData,
    });

    await prisma.foodItemIngredient.deleteMany({ where: { foodItemId: foodItem.id } });
    await prisma.foodItemIngredient.createMany({
      data: ingredients.map((ingredient) => ({
        foodItemId: foodItem.id,
        name: ingredient.name,
        quantityPerServing: ingredient.quantityPerServing,
        unit: ingredient.unit,
        productId: productIdByName.get(ingredient.name) ?? null,
      })),
    });
  }
  console.log(`  Seeded ${foods.length} food items.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
