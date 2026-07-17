import Image from "next/image";
import { cn } from "@/lib/utils";

// Fluent Emoji 3D (Microsoft, MIT licensed) — used for feature/empty-state illustrations
// alongside Lucide's flat icons for functional UI.
const ICONS_3D = {
  sparkles: "/icons/3d/sparkles.png",
  "pot-of-food": "/icons/3d/pot_of_food.png",
  "fork-and-knife-with-plate": "/icons/3d/fork_and_knife_with_plate.png",
  stethoscope: "/icons/3d/stethoscope.png",
  "shopping-cart": "/icons/3d/shopping_cart.png",
  package: "/icons/3d/package.png",
} as const;

export type Icon3DName = keyof typeof ICONS_3D;

export function Icon3D({ name, size = 48, className }: { name: Icon3DName; size?: number; className?: string }) {
  return (
    <Image
      src={ICONS_3D[name]}
      alt=""
      width={size}
      height={size}
      className={cn("select-none object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}
