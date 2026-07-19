"use client";

import Image from "next/image";
import { Heart, Loader2, MessageCircle, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon3D } from "@/components/icon-3d";
import { CreatePostDialog } from "@/components/feed/create-post-dialog";
import { TrendingDishes } from "@/components/feed/trending-dishes";
import { useFeedPosts, useLikePost } from "@/hooks/use-feed";
import { useAuth } from "@/lib/auth-context";
import { formatRelativeTime } from "@/lib/utils";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function FeedPage() {
  const { data: posts, isLoading } = useFeedPosts();
  const { user } = useAuth();
  const like = useLikePost();
  const firstName = user?.fullName.split(" ")[0];

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">
            {getGreeting()}{firstName ? `, ${firstName}` : ""} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Meal preps, recipes, and dietitian tips from the community.</p>
        </div>
        <CreatePostDialog
          trigger={
            <Button size="icon" className="shrink-0 rounded-full">
              <Plus className="size-5" />
            </Button>
          }
        />
      </div>

      <TrendingDishes />

      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && posts?.length === 0 && (
        <Card className="overflow-hidden">
          <div className="relative h-40 w-full">
            <Image src="/images/foods/hero-spread.jpg" alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <Icon3D name="fork-and-knife-with-plate" size={48} />
            <p className="text-sm font-medium">The feed is just getting started</p>
            <p className="text-xs text-muted-foreground">
              Be the first to share a meal prep, recipe, or nutrition tip with the Dr Foods community.
            </p>
            <CreatePostDialog trigger={<Button size="sm">Share a meal</Button>} />
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-4">
        {posts?.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <div className="flex items-center gap-2.5 p-3">
              <Avatar className="size-9 ring-2 ring-primary/15 ring-offset-2 ring-offset-card">
                <AvatarFallback className="text-xs">{post.author.fullName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold leading-tight">{post.author.fullName}</p>
                <p className="text-[11px] text-muted-foreground">{formatRelativeTime(post.createdAt)}</p>
              </div>
            </div>
            <div className="relative aspect-square w-full bg-muted">
              <Image src={post.imageUrl} alt={post.caption ?? ""} fill className="object-cover" />
              {post.foodItem && (
                <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                  {post.foodItem.name}
                </span>
              )}
            </div>
            <CardContent className="flex flex-col gap-2 p-3">
              {post.caption && <p className="text-sm">{post.caption}</p>}
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2" onClick={() => like.mutate(post.id)}>
                  <Heart className="size-4" /> {post._count.likes}
                </Button>
                <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2">
                  <MessageCircle className="size-4" /> {post._count.comments}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
