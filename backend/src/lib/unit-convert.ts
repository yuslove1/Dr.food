// Minimal unit conversion for turning a recipe-scale ingredient quantity (e.g. "150 g")
// into the quantity of a catalog product's purchase unit (e.g. "kg") for pricing/cart purposes.

const CONVERSIONS: Record<string, Record<string, number>> = {
  g: { kg: 1 / 1000 },
  kg: { g: 1000 },
  ml: { litre: 1 / 1000 },
  litre: { ml: 1000 },
};

export function convertQuantity(quantity: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return quantity;
  const factor = CONVERSIONS[fromUnit]?.[toUnit];
  if (factor === undefined) return quantity;
  return quantity * factor;
}
