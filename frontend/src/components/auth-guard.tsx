"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    } else if (!loading && user && !user.onboardingComplete) {
      router.replace("/onboarding");
    }
  }, [loading, user, router]);

  if (loading || !user || !user.onboardingComplete) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
