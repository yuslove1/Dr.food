"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, Leaf, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/tag-input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useSaveHealthProfile } from "@/hooks/use-profile";
import type { ActivityLevel, BudgetPeriod, DeliveryZone } from "@/types/api";

const GOAL_OPTIONS = [
  "General healthy eating",
  "Weight loss",
  "Muscle gain",
  "Hypertension management",
  "Diabetes management",
  "Post-partum nutrition",
];

const STEPS = ["About you", "Health & goals", "Budget & delivery"];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading, refetchUser } = useAuth();
  const saveProfile = useSaveHealthProfile();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("MODERATE");

  const [goals, setGoals] = useState<string[]>([]);
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);

  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetPeriod, setBudgetPeriod] = useState<BudgetPeriod>("WEEKLY");
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>("LEKKI");
  const [address, setAddress] = useState("");

  function toggleGoal(goal: string) {
    setGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));
  }

  async function handleFinish() {
    try {
      await saveProfile.mutateAsync({
        age: age ? Number(age) : undefined,
        gender: gender || undefined,
        heightCm: heightCm ? Number(heightCm) : undefined,
        weightKg: weightKg ? Number(weightKg) : undefined,
        activityLevel,
        goals,
        medicalConditions,
        dietaryRestrictions,
        allergies,
        budgetAmount: budgetAmount ? Number(budgetAmount) : undefined,
        budgetPeriod,
        deliveryZone,
        address: address || undefined,
      });
      await refetchUser();
      toast.success("Profile complete — building your first plan is next!");
      router.replace("/nutrition");
    } catch {
      toast.error("Could not save your profile. Please try again.");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 py-8">
      <div className="mb-6 flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Leaf className="size-5" />
        </span>
        <span className="font-display text-lg font-bold tracking-tight">Dr Foods</span>
      </div>

      <div className="mb-2 flex items-center justify-between">
        {step > 0 ? (
          <button onClick={() => setStep((s) => s - 1)} className="flex items-center gap-1 text-sm text-muted-foreground">
            <ChevronLeft className="size-4" /> Back
          </button>
        ) : (
          <span />
        )}
        <span className="text-xs font-medium text-muted-foreground">
          Step {step + 1} of {STEPS.length}
        </span>
      </div>
      <Progress value={((step + 1) / STEPS.length) * 100} className="mb-6" />

      <h1 className="font-display text-xl font-bold">{STEPS[step]}</h1>

      {step === 0 && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" min={1} value={age} onChange={(e) => setAge(e.target.value)} placeholder="32" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gender">Gender</Label>
              <Input id="gender" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Female" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="165" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="70" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Activity level</Label>
            <Select value={activityLevel} onValueChange={(v) => setActivityLevel(v as ActivityLevel)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SEDENTARY">Sedentary — little exercise</SelectItem>
                <SelectItem value="LIGHT">Light — 1-2 days/week</SelectItem>
                <SelectItem value="MODERATE">Moderate — 3-4 days/week</SelectItem>
                <SelectItem value="ACTIVE">Active — 5-6 days/week</SelectItem>
                <SelectItem value="VERY_ACTIVE">Very active — daily training</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button size="lg" className="mt-2" onClick={() => setStep(1)}>
            Continue
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="mt-6 flex flex-col gap-5">
          <div>
            <Label className="mb-2 block">Goals</Label>
            <div className="flex flex-wrap gap-2">
              {GOAL_OPTIONS.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                    goals.includes(goal)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  )}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Medical conditions</Label>
            <TagInput value={medicalConditions} onChange={setMedicalConditions} placeholder="e.g. Hypertension — press Enter" />
          </div>
          <div className="space-y-1.5">
            <Label>Dietary restrictions</Label>
            <TagInput value={dietaryRestrictions} onChange={setDietaryRestrictions} placeholder="e.g. Low sodium — press Enter" />
          </div>
          <div className="space-y-1.5">
            <Label>Allergies</Label>
            <TagInput value={allergies} onChange={setAllergies} placeholder="e.g. Groundnut — press Enter" />
          </div>
          <Button size="lg" className="mt-2" onClick={() => setStep(2)}>
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="budget">Food budget (₦)</Label>
              <Input id="budget" type="number" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} placeholder="25000" />
            </div>
            <div className="space-y-1.5">
              <Label>Per</Label>
              <Select value={budgetPeriod} onValueChange={(v) => setBudgetPeriod(v as BudgetPeriod)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEEKLY">Week</SelectItem>
                  <SelectItem value="MONTHLY">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Delivery zone</Label>
            <Select value={deliveryZone} onValueChange={(v) => setDeliveryZone(v as DeliveryZone)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LEKKI">Lekki</SelectItem>
                <SelectItem value="VICTORIA_ISLAND">Victoria Island</SelectItem>
                <SelectItem value="IKEJA">Ikeja</SelectItem>
                <SelectItem value="YABA">Yaba</SelectItem>
                <SelectItem value="SURULERE">Surulere</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">Delivery address</Label>
            <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, area, landmark" />
          </div>
          <Button size="lg" className="mt-2" disabled={saveProfile.isPending} onClick={handleFinish}>
            {saveProfile.isPending && <Loader2 className="animate-spin" />}
            Finish setup
          </Button>
        </div>
      )}
    </div>
  );
}
