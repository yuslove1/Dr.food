import type { ReactNode } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { AuthGuard } from "@/components/auth-guard";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="mx-auto flex w-full max-w-6xl flex-1 md:gap-8 md:px-8">
        <SidebarNav />
        <div className="flex w-full flex-1 flex-col">
          <AppHeader />
          <main className="mx-auto w-full max-w-md flex-1 px-5 pb-24 pt-2 md:max-w-2xl md:px-0 md:pb-12 md:pt-8">
            {children}
          </main>
        </div>
      </div>
      <BottomNav />
    </AuthGuard>
  );
}
