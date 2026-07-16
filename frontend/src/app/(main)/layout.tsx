import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { AuthGuard } from "@/components/auth-guard";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AppHeader />
      <main className="mx-auto w-full max-w-md flex-1 px-5 pb-24 pt-2">{children}</main>
      <BottomNav />
    </AuthGuard>
  );
}
