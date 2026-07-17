// Seed catalog for Dr Foods Bank. Prices are approximate Lagos market rates (Naira)
// for MVP purposes — to be replaced with live supplier pricing per PRD section 4 (Pillar 1).

export interface SeedProduct {
  name: string;
  category:
    | "PROTEIN"
    | "GRAIN"
    | "VEGETABLE"
    | "FRUIT"
    | "SOUP"
    | "SNACK"
    | "SPICE"
    | "PANTRY";
  unit: string;
  pricePerUnit: number;
  stockQty: number;
  imageUrl?: string;
  conditionTags?: string[];
  storageMethod?: string;
  shelfLifeDays?: number;
  prepInstructions?: string;
}

export const products: SeedProduct[] = [
  { name: "Rice (Long Grain)", category: "GRAIN", unit: "kg", pricePerUnit: 1800, stockQty: 500, storageMethod: "Store in a sealed container in a cool, dry place.", shelfLifeDays: 365, prepInstructions: "Rinse 2-3 times before cooking to remove excess starch." },
  { name: "Fresh Tomatoes", category: "VEGETABLE", unit: "kg", pricePerUnit: 900, stockQty: 200, storageMethod: "Refrigerate, or blend and freeze in portions.", shelfLifeDays: 7, prepInstructions: "Blend fresh or freeze pre-blended in weekly portions." },
  { name: "Tatashe Pepper (Bell Pepper)", category: "VEGETABLE", unit: "kg", pricePerUnit: 1500, stockQty: 150, storageMethod: "Refrigerate; freezes well when blended.", shelfLifeDays: 10 },
  { name: "Scotch Bonnet Pepper (Ata Rodo)", category: "VEGETABLE", unit: "kg", pricePerUnit: 2500, stockQty: 100, storageMethod: "Refrigerate, or freeze whole.", shelfLifeDays: 14 },
  { name: "Onions", category: "VEGETABLE", unit: "kg", pricePerUnit: 800, stockQty: 250, storageMethod: "Store in a cool, dry, well-ventilated place — do not refrigerate.", shelfLifeDays: 30 },
  { name: "Chicken", category: "PROTEIN", unit: "kg", pricePerUnit: 4500, stockQty: 150, storageMethod: "Freeze immediately if not used within 2 days.", shelfLifeDays: 2, prepInstructions: "Portion into meal-size packs before freezing." },
  { name: "Beef", category: "PROTEIN", unit: "kg", pricePerUnit: 5500, stockQty: 150, storageMethod: "Freeze in meal-size portions.", shelfLifeDays: 3 },
  { name: "Goat Meat", category: "PROTEIN", unit: "kg", pricePerUnit: 6500, stockQty: 100, storageMethod: "Freeze in meal-size portions.", shelfLifeDays: 3 },
  { name: "Assorted Meat (Cow)", category: "PROTEIN", unit: "kg", pricePerUnit: 5000, stockQty: 100, storageMethod: "Freeze in meal-size portions.", shelfLifeDays: 3 },
  { name: "Stockfish", category: "PROTEIN", unit: "kg", pricePerUnit: 8000, stockQty: 80, imageUrl: "/images/foods/product-stockfish.jpg", storageMethod: "Store in a cool, dry place, or freeze once soaked.", shelfLifeDays: 180, prepInstructions: "Soak overnight before use to soften." },
  { name: "Dried Fish", category: "PROTEIN", unit: "kg", pricePerUnit: 6000, stockQty: 80, storageMethod: "Store in an airtight container in a cool, dry place.", shelfLifeDays: 90 },
  { name: "Crayfish (Ground)", category: "PROTEIN", unit: "kg", pricePerUnit: 7000, stockQty: 80, imageUrl: "/images/foods/product-crayfish.jpg", storageMethod: "Store in an airtight container; refrigerate for longer freshness.", shelfLifeDays: 120 },
  { name: "Palm Oil", category: "PANTRY", unit: "litre", pricePerUnit: 2200, stockQty: 200, storageMethod: "Store in a cool, dark place, tightly sealed.", shelfLifeDays: 365 },
  { name: "Vegetable Oil", category: "PANTRY", unit: "litre", pricePerUnit: 1800, stockQty: 200, storageMethod: "Store in a cool, dark place, tightly sealed.", shelfLifeDays: 365 },
  { name: "Egusi Seeds (Ground)", category: "PROTEIN", unit: "kg", pricePerUnit: 4500, stockQty: 100, imageUrl: "/images/foods/product-egusi-seeds.jpg", storageMethod: "Store in an airtight container in a cool, dry place.", shelfLifeDays: 180 },
  { name: "Ugu Leaves (Fluted Pumpkin)", category: "VEGETABLE", unit: "bunch", pricePerUnit: 500, stockQty: 150, storageMethod: "Refrigerate; use within a few days for best texture.", shelfLifeDays: 5, prepInstructions: "Wash and shred just before cooking." },
  { name: "Spinach", category: "VEGETABLE", unit: "bunch", pricePerUnit: 400, stockQty: 150, storageMethod: "Refrigerate in a breathable bag.", shelfLifeDays: 5 },
  { name: "Bitterleaf (Washed)", category: "VEGETABLE", unit: "kg", pricePerUnit: 1200, stockQty: 80, storageMethod: "Refrigerate or freeze if not used within 2 days.", shelfLifeDays: 4 },
  { name: "Ogbono Seeds (Ground)", category: "PROTEIN", unit: "kg", pricePerUnit: 6000, stockQty: 80, imageUrl: "/images/foods/product-ogbono-seeds.jpg", storageMethod: "Store in an airtight container in a cool, dry place.", shelfLifeDays: 180 },
  { name: "Okra", category: "VEGETABLE", unit: "kg", pricePerUnit: 900, stockQty: 120, storageMethod: "Refrigerate; use within a few days.", shelfLifeDays: 5 },
  { name: "Yam Tuber", category: "GRAIN", unit: "kg", pricePerUnit: 900, stockQty: 200, storageMethod: "Store whole in a cool, dry, well-ventilated place.", shelfLifeDays: 60, prepInstructions: "Peel and cut just before cooking to avoid discoloration." },
  { name: "Yam Flour (Elubo)", category: "GRAIN", unit: "kg", pricePerUnit: 2500, stockQty: 120, storageMethod: "Store in an airtight container in a cool, dry place.", shelfLifeDays: 270 },
  { name: "Corn Pap Powder (Akamu)", category: "GRAIN", unit: "kg", pricePerUnit: 1200, stockQty: 120, storageMethod: "Store in an airtight container in a cool, dry place.", shelfLifeDays: 180 },
  { name: "Beans (Honey/Oloyin)", category: "PROTEIN", unit: "kg", pricePerUnit: 2200, stockQty: 150, imageUrl: "/images/foods/beans-porridge.jpg", storageMethod: "Store in an airtight container in a cool, dry place.", shelfLifeDays: 270 },
  { name: "Peeled Beans", category: "PROTEIN", unit: "kg", pricePerUnit: 2500, stockQty: 100, imageUrl: "/images/foods/beans-porridge.jpg", storageMethod: "Store in an airtight container; refrigerate once soaked.", shelfLifeDays: 180 },
  { name: "Plantain", category: "FRUIT", unit: "piece", pricePerUnit: 400, stockQty: 300, storageMethod: "Store at room temperature; refrigerate once ripe to slow further ripening.", shelfLifeDays: 7 },
  { name: "Eggs", category: "PROTEIN", unit: "piece", pricePerUnit: 150, stockQty: 1000, imageUrl: "/images/foods/product-eggs.jpg", storageMethod: "Refrigerate.", shelfLifeDays: 21 },
  { name: "Cocoyam", category: "GRAIN", unit: "kg", pricePerUnit: 1000, stockQty: 100, storageMethod: "Store in a cool, dry, well-ventilated place.", shelfLifeDays: 30 },
  { name: "Suya Spice (Yaji)", category: "SPICE", unit: "pack", pricePerUnit: 1000, stockQty: 100, storageMethod: "Store in an airtight container away from light.", shelfLifeDays: 180 },
  { name: "Pepper Soup Spice Mix", category: "SPICE", unit: "pack", pricePerUnit: 800, stockQty: 100, storageMethod: "Store in an airtight container away from light.", shelfLifeDays: 180 },
  { name: "Cow Foot (Nkwobi Cut)", category: "PROTEIN", unit: "kg", pricePerUnit: 5000, stockQty: 60, storageMethod: "Freeze if not used within 2 days.", shelfLifeDays: 2 },
  { name: "Utazi Leaf", category: "VEGETABLE", unit: "bunch", pricePerUnit: 300, stockQty: 80, storageMethod: "Refrigerate.", shelfLifeDays: 5 },
  { name: "Potash (Akaun)", category: "SPICE", unit: "pack", pricePerUnit: 200, stockQty: 100, storageMethod: "Store in a dry place.", shelfLifeDays: 365 },
  { name: "Breadfruit Seeds (Ukwa)", category: "GRAIN", unit: "kg", pricePerUnit: 3000, stockQty: 60, storageMethod: "Store in an airtight container in a cool, dry place.", shelfLifeDays: 90 },
  { name: "Ponmo (Cow Skin)", category: "PROTEIN", unit: "kg", pricePerUnit: 3500, stockQty: 80, imageUrl: "/images/foods/product-ponmo.jpg", storageMethod: "Freeze if not used within 2 days.", shelfLifeDays: 3 },
  { name: "Coconut Milk", category: "PANTRY", unit: "litre", pricePerUnit: 1800, stockQty: 80, storageMethod: "Refrigerate after opening; use within 3 days.", shelfLifeDays: 5 },
  { name: "Wheat Flour", category: "PANTRY", unit: "kg", pricePerUnit: 1200, stockQty: 150, storageMethod: "Store in an airtight container in a cool, dry place.", shelfLifeDays: 180 },
  { name: "Sugar", category: "PANTRY", unit: "kg", pricePerUnit: 1500, stockQty: 150, storageMethod: "Store in an airtight container.", shelfLifeDays: 730 },
  { name: "Nutmeg (Ground)", category: "SPICE", unit: "pack", pricePerUnit: 600, stockQty: 100, storageMethod: "Store in an airtight container away from light.", shelfLifeDays: 365 },
];
