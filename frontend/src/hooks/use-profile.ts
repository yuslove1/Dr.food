import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ActivityLevel, BudgetPeriod, DeliveryZone, FamilyMember, HealthProfile } from "@/types/api";

export interface HealthProfileInput {
  age?: number;
  gender?: string;
  heightCm?: number;
  weightKg?: number;
  activityLevel?: ActivityLevel;
  goals?: string[];
  medicalConditions?: string[];
  dietaryRestrictions?: string[];
  allergies?: string[];
  budgetAmount?: number;
  budgetPeriod?: BudgetPeriod;
  deliveryZone?: DeliveryZone;
  address?: string;
}

export function useHealthProfile() {
  return useQuery({
    queryKey: ["health-profile"],
    queryFn: () => api.get<HealthProfile | null>("/users/profile"),
  });
}

export function useSaveHealthProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: HealthProfileInput) => api.put<HealthProfile>("/users/profile", input),
    onSuccess: (data) => {
      queryClient.setQueryData(["health-profile"], data);
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
  });
}

export function useFamilyMembers() {
  return useQuery({
    queryKey: ["family-members"],
    queryFn: () => api.get<FamilyMember[]>("/users/family"),
  });
}

export function useAddFamilyMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<FamilyMember>) => api.post<FamilyMember>("/users/family", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["family-members"] }),
  });
}

export function useDeleteFamilyMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => api.delete(`/users/family/${memberId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["family-members"] }),
  });
}
