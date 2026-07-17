"use client";

import { useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreatePost, useUploadPostImage } from "@/hooks/use-feed";
import { useFoodItems } from "@/hooks/use-nutrition";
import { ApiError } from "@/lib/api";

export function CreatePostDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [foodItemId, setFoodItemId] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: foodItems } = useFoodItems();
  const uploadImage = useUploadPostImage();
  const createPost = useCreatePost();

  function reset() {
    setFile(null);
    setPreviewUrl(null);
    setCaption("");
    setFoodItemId("");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  async function handleSubmit() {
    if (!file) {
      toast.error("Choose a photo to post");
      return;
    }
    try {
      const { url } = await uploadImage.mutateAsync(file);
      await createPost.mutateAsync({
        imageUrl: url,
        caption: caption.trim() || undefined,
        foodItemId: foodItemId || undefined,
      });
      toast.success("Posted to the feed!");
      reset();
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not create post");
    }
  }

  const submitting = uploadImage.isPending || createPost.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share a meal</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

          {previewUrl ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element -- blob: preview URL, next/image can't optimize it */}
              <img src={previewUrl} alt="Preview" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreviewUrl(null);
                }}
                className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
            >
              <ImagePlus className="size-8" />
              <span className="text-sm font-medium">Choose a photo</span>
            </button>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What did you make?"
            />
          </div>

          {foodItems && foodItems.length > 0 && (
            <div className="space-y-1.5">
              <Label>Tag a dish (optional)</Label>
              <Select value={foodItemId} onValueChange={setFoodItemId}>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {foodItems.map((food) => (
                    <SelectItem key={food.id} value={food.id}>
                      {food.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button size="lg" disabled={submitting} onClick={handleSubmit}>
            {submitting && <Loader2 className="animate-spin" />}
            {uploadImage.isPending ? "Uploading..." : "Post"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
