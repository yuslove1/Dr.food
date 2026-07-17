import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, apiUpload } from "@/lib/api";

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

export function useUploadPostImage() {
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      return apiUpload<{ url: string }>("/feed/upload", formData);
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { imageUrl: string; caption?: string; foodItemId?: string }) =>
      api.post<FeedPost>("/feed/posts", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feed-posts"] }),
  });
}
