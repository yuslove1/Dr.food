"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Package, Salad, ShoppingBasket, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  if (!user) return null;

  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="flex items-center gap-3">
        <Avatar className="size-14">
          <AvatarFallback className="text-lg">{user.fullName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-display text-lg font-bold">{user.fullName}</p>
          <p className="text-sm text-muted-foreground">{user.email ?? user.phone}</p>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col divide-y divide-border p-0">
          <ProfileLink href="/onboarding" icon={User} label="Health profile & preferences" />
          <ProfileLink href="/nutrition" icon={Salad} label="Meal plans" />
          <ProfileLink href="/bank/orders" icon={Package} label="Order history" />
          <ProfileLink href="/bank/cart" icon={ShoppingBasket} label="Cart" />
        </CardContent>
      </Card>

      <Separator />

      <Button variant="outline" className="justify-start gap-2 text-destructive" onClick={handleLogout}>
        <LogOut className="size-4" />
        Log out
      </Button>
    </div>
  );
}

function ProfileLink({ href, icon: Icon, label }: { href: string; icon: typeof User; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 p-4 text-sm font-medium hover:bg-muted">
      <Icon className="size-4 text-muted-foreground" />
      {label}
    </Link>
  );
}
