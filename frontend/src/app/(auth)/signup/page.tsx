"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await signup({ fullName, email, password });
      router.replace("/onboarding");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not create account");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10">
      <div className="mb-8 flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Leaf className="size-5" />
        </span>
        <span className="font-display text-lg font-bold tracking-tight">Dr Foods</span>
      </div>

      <h1 className="font-display text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">Start with a free AI meal plan tailored to you.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Temi Adebayo" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
        </div>
        <Button type="submit" size="lg" disabled={submitting} className="mt-2">
          {submitting && <Loader2 className="animate-spin" />}
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary">
          Sign in
        </Link>
      </p>
    </div>
  );
}
