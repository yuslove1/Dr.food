import Link from "next/link";
import { Leaf } from "lucide-react";

export function AppHeader({ title }: { title?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-md items-center justify-between px-5 py-4">
        <Link href="/feed" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="size-4" />
          </span>
          <span className="font-display text-base font-bold tracking-tight">Dr Foods</span>
        </Link>
        {title && <h1 className="font-display text-sm font-semibold text-muted-foreground">{title}</h1>}
      </div>
    </header>
  );
}
