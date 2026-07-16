import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { MealPlan } from "@/types/api";

export function useMealPlans() {
  return useQuery({
    queryKey: ["meal-plans"],
    queryFn: () => api.get<MealPlan[]>("/nutrition/plans"),
  });
}

export function useMealPlan(planId: string | undefined) {
  return useQuery({
    queryKey: ["meal-plan", planId],
    queryFn: () => api.get<MealPlan>(`/nutrition/plans/${planId}`),
    enabled: Boolean(planId),
  });
}

export function useGenerateMealPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { type: "WEEKLY" | "MONTHLY"; familyMemberId?: string }) =>
      api.post<MealPlan>("/nutrition/plans/generate", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["meal-plans"] }),
  });
}

export function useSendShoppingListToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (shoppingListId: string) => api.post(`/nutrition/shopping-lists/${shoppingListId}/send-to-cart`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
    },
  });
}
