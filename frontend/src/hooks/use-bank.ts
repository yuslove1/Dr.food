import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Cart, Order, Payment, Product } from "@/types/api";

export function useProducts(category?: string) {
  return useQuery({
    queryKey: ["products", category],
    queryFn: () => api.get<Product[]>(`/bank/products${category ? `?category=${category}` : ""}`),
  });
}

export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => api.get<Cart>("/bank/cart"),
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { productId: string; quantity?: number }) => api.post("/bank/cart/items", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      api.put(`/bank/cart/items/${productId}`, { quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { orderType: string; deliveryDate: string; deliveryWindow: string; deliveryAddress: string }) =>
      api.post<{ order: Order; payment: Payment }>("/bank/checkout", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useMockConfirmPayment() {
  return useMutation({
    mutationFn: (paymentId: string) => api.post<Payment>(`/bank/payments/${paymentId}/mock-confirm`),
  });
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => api.get<Order[]>("/bank/orders"),
  });
}

export function useOrder(orderId: string | undefined) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => api.get<Order>(`/bank/orders/${orderId}`),
    enabled: Boolean(orderId),
  });
}
