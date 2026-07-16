import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface FeedPost {
  id: string;
  caption: string | null;
  imageUrl: string;
  authorType: string;
  createdAt: string;
  author: { id: string; fullName: string };
  foodItem: { id: string; name: string } | null;
  _count: { likes: number; comments: number };
}

export function useFeedPosts() {
  return useQuery({
    queryKey: ["feed-posts"],
    queryFn: () => api.get<FeedPost[]>("/feed/posts"),
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => api.post(`/feed/posts/${postId}/like`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feed-posts"] }),
  });
}
