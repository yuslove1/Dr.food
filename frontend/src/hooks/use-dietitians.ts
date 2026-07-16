import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Dietitian {
  id: string;
  bio: string | null;
  specializations: string[];
  verified: boolean;
  pricePerSession: string;
  yearsExperience: number | null;
  user: { id: string; fullName: string };
}

export function useDietitians() {
  return useQuery({
    queryKey: ["dietitians"],
    queryFn: () => api.get<Dietitian[]>("/dietitians"),
  });
}
