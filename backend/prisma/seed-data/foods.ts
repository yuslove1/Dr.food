// Seed Nigerian food & nutrition dataset. Macro values are reasonable per-100g estimates
// for MVP grounding of the AI nutrition engine — flagged in the PRD as needing review by
// founding dietitian partners before launch (see "Nigerian food AI data quality" risk).

export interface SeedFoodIngredient {
  name: string; // must match a SeedProduct name in products.ts
  quantityPerServing: number;
  unit: string;
}

export interface SeedFood {
  name: string;
  localName?: string;
  category:
    | "PROTEIN"
    | "GRAIN"
    | "VEGETABLE"
    | "FRUIT"
    | "SOUP"
    | "SNACK"
    | "SPICE"
    | "PANTRY";
  caloriesPer100g: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  tags: string[]; // suitable meal times / occasions, used to guide AI plan generation
  description: string;
  ingredients: SeedFoodIngredient[];
}

export const foods: SeedFood[] = [
  {
    name: "Akamu with Akara",
    localName: "Akamu & Akara",
    category: "GRAIN",
    caloriesPer100g: 150, proteinG: 5, carbsG: 18, fatG: 6, fiberG: 2,
    tags: ["breakfast"],
    description: "Fermented corn pap porridge served with fried bean cakes.",
    ingredients: [
      { name: "Corn Pap Powder (Akamu)", quantityPerServing: 80, unit: "g" },
      { name: "Peeled Beans", quantityPerServing: 100, unit: "g" },
      { name: "Onions", quantityPerServing: 20, unit: "g" },
      { name: "Scotch Bonnet Pepper (Ata Rodo)", quantityPerServing: 10, unit: "g" },
      { name: "Vegetable Oil", quantityPerServing: 40, unit: "ml" },
    ],
  },
  {
    name: "Yam and Egg Sauce",
    localName: "Yam & Egg",
    category: "GRAIN",
    caloriesPer100g: 150, proteinG: 6, carbsG: 22, fatG: 5, fiberG: 2,
    tags: ["breakfast", "lunch"],
    description: "Boiled yam served with a spicy tomato and egg sauce.",
    ingredients: [
      { name: "Yam Tuber", quantityPerServing: 250, unit: "g" },
      { name: "Eggs", quantityPerServing: 2, unit: "piece" },
      { name: "Fresh Tomatoes", quantityPerServing: 100, unit: "g" },
      { name: "Onions", quantityPerServing: 30, unit: "g" },
      { name: "Vegetable Oil", quantityPerServing: 30, unit: "ml" },
    ],
  },
  {
    name: "Moi Moi",
    category: "PROTEIN",
    caloriesPer100g: 180, proteinG: 10, carbsG: 15, fatG: 9, fiberG: 4,
    tags: ["breakfast", "snack", "side"],
    description: "Steamed bean pudding with pepper, onion, and egg.",
    ingredients: [
      { name: "Peeled Beans", quantityPerServing: 150, unit: "g" },
      { name: "Tatashe Pepper (Bell Pepper)", quantityPerServing: 40, unit: "g" },
      { name: "Onions", quantityPerServing: 20, unit: "g" },
      { name: "Eggs", quantityPerServing: 1, unit: "piece" },
      { name: "Palm Oil", quantityPerServing: 20, unit: "ml" },
      { name: "Crayfish (Ground)", quantityPerServing: 10, unit: "g" },
    ],
  },
  {
    name: "Akara",
    category: "SNACK",
    caloriesPer100g: 300, proteinG: 12, carbsG: 20, fatG: 20, fiberG: 5,
    tags: ["breakfast", "snack"],
    description: "Deep-fried bean cakes.",
    ingredients: [
      { name: "Peeled Beans", quantityPerServing: 150, unit: "g" },
      { name: "Onions", quantityPerServing: 20, unit: "g" },
      { name: "Scotch Bonnet Pepper (Ata Rodo)", quantityPerServing: 10, unit: "g" },
      { name: "Vegetable Oil", quantityPerServing: 60, unit: "ml" },
    ],
  },
  {
    name: "Jollof Rice",
    category: "GRAIN",
    caloriesPer100g: 180, proteinG: 4, carbsG: 30, fatG: 5, fiberG: 1.5,
    tags: ["lunch", "dinner", "party"],
    description: "Rice cooked in a rich tomato and pepper stew.",
    ingredients: [
      { name: "Rice (Long Grain)", quantityPerServing: 150, unit: "g" },
      { name: "Fresh Tomatoes", quantityPerServing: 120, unit: "g" },
      { name: "Tatashe Pepper (Bell Pepper)", quantityPerServing: 40, unit: "g" },
      { name: "Onions", quantityPerServing: 40, unit: "g" },
      { name: "Chicken", quantityPerServing: 150, unit: "g" },
      { name: "Vegetable Oil", quantityPerServing: 30, unit: "ml" },
    ],
  },
  {
    name: "Fried Rice",
    category: "GRAIN",
    caloriesPer100g: 190, proteinG: 5, carbsG: 28, fatG: 6, fiberG: 1.5,
    tags: ["lunch", "dinner", "party"],
    description: "Rice stir-fried with mixed vegetables and liver.",
    ingredients: [
      { name: "Rice (Long Grain)", quantityPerServing: 150, unit: "g" },
      { name: "Onions", quantityPerServing: 30, unit: "g" },
      { name: "Tatashe Pepper (Bell Pepper)", quantityPerServing: 30, unit: "g" },
      { name: "Chicken", quantityPerServing: 120, unit: "g" },
      { name: "Vegetable Oil", quantityPerServing: 30, unit: "ml" },
    ],
  },
  {
    name: "Coconut Rice",
    category: "GRAIN",
    caloriesPer100g: 200, proteinG: 4, carbsG: 30, fatG: 7, fiberG: 1.3,
    tags: ["lunch", "dinner"],
    description: "Rice cooked in coconut milk with a light pepper base.",
    ingredients: [
      { name: "Rice (Long Grain)", quantityPerServing: 150, unit: "g" },
      { name: "Coconut Milk", quantityPerServing: 150, unit: "ml" },
      { name: "Scotch Bonnet Pepper (Ata Rodo)", quantityPerServing: 15, unit: "g" },
      { name: "Onions", quantityPerServing: 30, unit: "g" },
    ],
  },
  {
    name: "Pounded Yam",
    category: "GRAIN",
    caloriesPer100g: 120, proteinG: 1.5, carbsG: 28, fatG: 0.2, fiberG: 2,
    tags: ["lunch", "dinner"],
    description: "Smooth swallow made from boiled, pounded yam.",
    ingredients: [{ name: "Yam Tuber", quantityPerServing: 300, unit: "g" }],
  },
  {
    name: "Amala",
    category: "GRAIN",
    caloriesPer100g: 110, proteinG: 1.8, carbsG: 25, fatG: 0.3, fiberG: 3,
    tags: ["lunch", "dinner"],
    description: "Swallow made from yam flour.",
    ingredients: [{ name: "Yam Flour (Elubo)", quantityPerServing: 150, unit: "g" }],
  },
  {
    name: "Yam Porridge",
    localName: "Asaro",
    category: "GRAIN",
    caloriesPer100g: 140, proteinG: 3, carbsG: 24, fatG: 4, fiberG: 2.5,
    tags: ["lunch", "dinner"],
    description: "Yam cooked down in a palm oil, pepper, and crayfish sauce.",
    ingredients: [
      { name: "Yam Tuber", quantityPerServing: 300, unit: "g" },
      { name: "Palm Oil", quantityPerServing: 30, unit: "ml" },
      { name: "Fresh Tomatoes", quantityPerServing: 80, unit: "g" },
      { name: "Crayfish (Ground)", quantityPerServing: 15, unit: "g" },
    ],
  },
  {
    name: "Egusi Soup",
    category: "SOUP",
    caloriesPer100g: 250, proteinG: 12, carbsG: 8, fatG: 20, fiberG: 3,
    tags: ["lunch", "dinner"],
    description: "Ground melon seed soup with leafy greens and assorted meat.",
    ingredients: [
      { name: "Egusi Seeds (Ground)", quantityPerServing: 100, unit: "g" },
      { name: "Ugu Leaves (Fluted Pumpkin)", quantityPerServing: 1, unit: "bunch" },
      { name: "Palm Oil", quantityPerServing: 40, unit: "ml" },
      { name: "Assorted Meat (Cow)", quantityPerServing: 150, unit: "g" },
      { name: "Stockfish", quantityPerServing: 50, unit: "g" },
      { name: "Crayfish (Ground)", quantityPerServing: 15, unit: "g" },
    ],
  },
  {
    name: "Efo Riro",
    category: "SOUP",
    caloriesPer100g: 180, proteinG: 10, carbsG: 5, fatG: 14, fiberG: 3,
    tags: ["lunch", "dinner"],
    description: "Rich vegetable soup made with spinach and assorted meat.",
    ingredients: [
      { name: "Spinach", quantityPerServing: 2, unit: "bunch" },
      { name: "Palm Oil", quantityPerServing: 40, unit: "ml" },
      { name: "Scotch Bonnet Pepper (Ata Rodo)", quantityPerServing: 20, unit: "g" },
      { name: "Assorted Meat (Cow)", quantityPerServing: 150, unit: "g" },
      { name: "Crayfish (Ground)", quantityPerServing: 15, unit: "g" },
    ],
  },
  {
    name: "Ogbono Soup",
    category: "SOUP",
    caloriesPer100g: 220, proteinG: 10, carbsG: 9, fatG: 17, fiberG: 4,
    tags: ["lunch", "dinner"],
    description: "Draw soup made from ground ogbono seeds.",
    ingredients: [
      { name: "Ogbono Seeds (Ground)", quantityPerServing: 80, unit: "g" },
      { name: "Palm Oil", quantityPerServing: 30, unit: "ml" },
      { name: "Assorted Meat (Cow)", quantityPerServing: 150, unit: "g" },
      { name: "Dried Fish", quantityPerServing: 40, unit: "g" },
    ],
  },
  {
    name: "Ofe Onugbu",
    localName: "Bitterleaf Soup",
    category: "SOUP",
    caloriesPer100g: 200, proteinG: 11, carbsG: 6, fatG: 15, fiberG: 3.5,
    tags: ["lunch", "dinner"],
    description: "Traditional Igbo bitterleaf soup with cocoyam thickener.",
    ingredients: [
      { name: "Bitterleaf (Washed)", quantityPerServing: 150, unit: "g" },
      { name: "Cocoyam", quantityPerServing: 200, unit: "g" },
      { name: "Palm Oil", quantityPerServing: 30, unit: "ml" },
      { name: "Stockfish", quantityPerServing: 50, unit: "g" },
      { name: "Assorted Meat (Cow)", quantityPerServing: 150, unit: "g" },
    ],
  },
  {
    name: "Okra Soup",
    category: "SOUP",
    caloriesPer100g: 150, proteinG: 9, carbsG: 7, fatG: 10, fiberG: 3,
    tags: ["lunch", "dinner"],
    description: "Light draw soup made from sliced okra.",
    ingredients: [
      { name: "Okra", quantityPerServing: 200, unit: "g" },
      { name: "Palm Oil", quantityPerServing: 25, unit: "ml" },
      { name: "Crayfish (Ground)", quantityPerServing: 15, unit: "g" },
      { name: "Assorted Meat (Cow)", quantityPerServing: 150, unit: "g" },
    ],
  },
  {
    name: "Pepper Soup",
    category: "SOUP",
    caloriesPer100g: 110, proteinG: 14, carbsG: 3, fatG: 5, fiberG: 1,
    tags: ["dinner", "light"],
    description: "Light, spicy broth with goat meat and native spices.",
    ingredients: [
      { name: "Goat Meat", quantityPerServing: 250, unit: "g" },
      { name: "Pepper Soup Spice Mix", quantityPerServing: 1, unit: "pack" },
      { name: "Scotch Bonnet Pepper (Ata Rodo)", quantityPerServing: 10, unit: "g" },
    ],
  },
  {
    name: "Beans Porridge",
    localName: "Ewa Agoyin",
    category: "PROTEIN",
    caloriesPer100g: 160, proteinG: 9, carbsG: 22, fatG: 5, fiberG: 6,
    tags: ["breakfast", "lunch", "dinner"],
    description: "Mashed beans served with a spicy pepper sauce.",
    ingredients: [
      { name: "Beans (Honey/Oloyin)", quantityPerServing: 200, unit: "g" },
      { name: "Palm Oil", quantityPerServing: 30, unit: "ml" },
      { name: "Scotch Bonnet Pepper (Ata Rodo)", quantityPerServing: 30, unit: "g" },
      { name: "Onions", quantityPerServing: 30, unit: "g" },
    ],
  },
  {
    name: "Suya",
    category: "PROTEIN",
    caloriesPer100g: 250, proteinG: 28, carbsG: 4, fatG: 14, fiberG: 1,
    tags: ["snack", "dinner"],
    description: "Skewered beef grilled with spiced suya pepper mix.",
    ingredients: [
      { name: "Beef", quantityPerServing: 200, unit: "g" },
      { name: "Suya Spice (Yaji)", quantityPerServing: 1, unit: "pack" },
      { name: "Onions", quantityPerServing: 30, unit: "g" },
    ],
  },
  {
    name: "Fried Plantain",
    localName: "Dodo",
    category: "SNACK",
    caloriesPer100g: 200, proteinG: 1.3, carbsG: 32, fatG: 8, fiberG: 2.3,
    tags: ["side", "snack"],
    description: "Sliced ripe plantain fried until golden.",
    ingredients: [
      { name: "Plantain", quantityPerServing: 2, unit: "piece" },
      { name: "Vegetable Oil", quantityPerServing: 40, unit: "ml" },
    ],
  },
  {
    name: "Nkwobi",
    category: "SNACK",
    caloriesPer100g: 280, proteinG: 18, carbsG: 3, fatG: 22, fiberG: 1,
    tags: ["snack", "appetizer"],
    description: "Spiced cow foot in a thick palm oil and potash sauce.",
    ingredients: [
      { name: "Cow Foot (Nkwobi Cut)", quantityPerServing: 250, unit: "g" },
      { name: "Palm Oil", quantityPerServing: 40, unit: "ml" },
      { name: "Potash (Akaun)", quantityPerServing: 1, unit: "pack" },
      { name: "Utazi Leaf", quantityPerServing: 1, unit: "bunch" },
    ],
  },
  {
    name: "Chin Chin",
    category: "SNACK",
    caloriesPer100g: 450, proteinG: 7, carbsG: 55, fatG: 22, fiberG: 1.5,
    tags: ["snack"],
    description: "Sweet, crunchy fried dough bites.",
    ingredients: [
      { name: "Wheat Flour", quantityPerServing: 150, unit: "g" },
      { name: "Sugar", quantityPerServing: 40, unit: "g" },
      { name: "Vegetable Oil", quantityPerServing: 200, unit: "ml" },
      { name: "Nutmeg (Ground)", quantityPerServing: 1, unit: "pack" },
    ],
  },
  {
    name: "Ukwa",
    localName: "Breadfruit Porridge",
    category: "SNACK",
    caloriesPer100g: 180, proteinG: 8, carbsG: 25, fatG: 6, fiberG: 5,
    tags: ["lunch", "snack"],
    description: "Breadfruit seeds cooked down with palm oil and ponmo.",
    ingredients: [
      { name: "Breadfruit Seeds (Ukwa)", quantityPerServing: 200, unit: "g" },
      { name: "Palm Oil", quantityPerServing: 30, unit: "ml" },
      { name: "Ponmo (Cow Skin)", quantityPerServing: 80, unit: "g" },
    ],
  },
];
