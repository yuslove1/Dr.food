import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { products } from "./seed-data/products";
import { foods } from "./seed-data/foods";

const prisma = new PrismaClient();

const TEST_ACCOUNT = {
  fullName: "Test User",
  email: "test@gmail.com",
  password: "Test123456789",
};

async function seedTestAccount() {
  console.log("Seeding test account...");
  const passwordHash = await bcrypt.hash(TEST_ACCOUNT.password, 10);

  const user = await prisma.user.upsert({
    where: { email: TEST_ACCOUNT.email },
    update: { passwordHash },
    create: {
      fullName: TEST_ACCOUNT.fullName,
      email: TEST_ACCOUNT.email,
      passwordHash,
      wallet: { create: { balance: 0 } },
    },
  });

  await prisma.healthProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      age: 32,
      gender: "female",
      heightCm: 165,
      weightKg: 70,
      activityLevel: "MODERATE",
      goals: ["General healthy eating", "Weight loss"],
      medicalConditions: [],
      dietaryRestrictions: [],
      allergies: [],
      budgetAmount: 25000,
      budgetPeriod: "WEEKLY",
      deliveryZone: "LEKKI",
      address: "12 Admiralty Way, Lekki Phase 1, Lagos",
    },
  });

  console.log(`  Test account ready: ${TEST_ACCOUNT.email} / ${TEST_ACCOUNT.password}`);
}

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

  await seedTestAccount();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
