"use client";

import Image from "next/image";
import { Heart, Loader2, MessageCircle, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useFeedPosts, useLikePost } from "@/hooks/use-feed";

export default function FeedPage() {
  const { data: posts, isLoading } = useFeedPosts();
  const like = useLikePost();

  return (
    <div className="flex flex-col gap-5 py-4">
      <div>
        <h1 className="font-display text-2xl font-bold">Home</h1>
        <p className="mt-1 text-sm text-muted-foreground">Meal preps, recipes, and dietitian tips from the community.</p>
      </div>

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
          <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
            <Sparkles className="size-6 text-primary" />
            <p className="text-sm font-medium">The feed is just getting started</p>
            <p className="text-xs text-muted-foreground">
              Meal preps, recipes, and dietitian tips will show up here as the Dr Foods community grows. Post
              creation is coming in the next build.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-4">
        {posts?.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <div className="flex items-center gap-2 p-3">
              <Avatar className="size-8">
                <AvatarFallback>{post.author.fullName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{post.author.fullName}</p>
                {post.foodItem && <p className="text-xs text-muted-foreground">{post.foodItem.name}</p>}
              </div>
            </div>
            <div className="relative aspect-square w-full bg-muted">
              <Image src={post.imageUrl} alt={post.caption ?? ""} fill className="object-cover" />
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
