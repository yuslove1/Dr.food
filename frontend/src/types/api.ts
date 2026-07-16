export type ActivityLevel = "SEDENTARY" | "LIGHT" | "MODERATE" | "ACTIVE" | "VERY_ACTIVE";
export type BudgetPeriod = "WEEKLY" | "MONTHLY";
export type DeliveryZone = "LEKKI" | "VICTORIA_ISLAND" | "IKEJA" | "YABA" | "SURULERE" | "OTHER";
export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
export type FoodCategory = "PROTEIN" | "GRAIN" | "VEGETABLE" | "FRUIT" | "SOUP" | "SNACK" | "SPICE" | "PANTRY";

export interface HealthProfile {
  id: string;
  age: number | null;
  gender: string | null;
  heightCm: number | null;
  weightKg: number | null;
  activityLevel: ActivityLevel;
  goals: string[];
  medicalConditions: string[];
  dietaryRestrictions: string[];
  allergies: string[];
  budgetAmount: string | null;
  budgetPeriod: BudgetPeriod;
  deliveryZone: DeliveryZone | null;
  address: string | null;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number | null;
  gender: string | null;
  medicalConditions: string[];
  dietaryRestrictions: string[];
  allergies: string[];
}

export interface FoodItem {
  id: string;
  name: string;
  localName: string | null;
  category: FoodCategory;
  caloriesPer100g: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  tags: string[];
  description: string | null;
  imageUrl: string | null;
}

export interface MealPlanEntry {
  id: string;
  dayOfWeek: number;
  mealType: MealType;
  servings: number;
  foodItem: FoodItem;
}

export interface ShoppingListItem {
  id: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  estimatedPrice: string | null;
  productId: string | null;
  product: Product | null;
}

export interface ShoppingList {
  id: string;
  status: "DRAFT" | "SENT_TO_CART" | "ORDERED";
  estimatedCost: string | null;
  items: ShoppingListItem[];
}

export interface MealPlan {
  id: string;
  type: "WEEKLY" | "MONTHLY";
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  totalEstimatedCost: string | null;
  entries: MealPlanEntry[];
  shoppingList: ShoppingList | null;
  familyMember: FamilyMember | null;
}

export interface Product {
  id: string;
  name: string;
  category: FoodCategory;
  unit: string;
  pricePerUnit: string;
  stockQty: number;
  imageUrl: string | null;
  description: string | null;
  storageMethod: string | null;
  shelfLifeDays: number | null;
  prepInstructions: string | null;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  product: Product;
}

export interface Order {
  id: string;
  orderType: string;
  status: "PENDING_PAYMENT" | "CONFIRMED" | "PACKED" | "DISPATCHED" | "DELIVERED" | "CANCELLED";
  deliveryDate: string;
  deliveryWindow: string;
  deliveryAddress: string;
  subtotal: string;
  deliveryFee: string;
  total: string;
  createdAt: string;
  items: OrderItem[];
  payments?: Payment[];
}

export interface Payment {
  id: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  amount: string;
  reference: string;
}
