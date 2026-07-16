"use client";

import { Loader2, Stethoscope } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useDietitians } from "@/hooks/use-dietitians";
import { formatNaira } from "@/lib/utils";

export default function DietitiansPage() {
  const { data: dietitians, isLoading } = useDietitians();

  return (
    <div className="flex flex-col gap-5 py-4">
      <div>
        <h1 className="font-display text-2xl font-bold">Dietitians</h1>
        <p className="mt-1 text-sm text-muted-foreground">Book a verified Nigerian nutrition specialist.</p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && dietitians?.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 p-10 text-center">
            <Stethoscope className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium">No dietitians listed yet</p>
            <p className="text-xs text-muted-foreground">
              Founding dietitian partners will appear here — booking, in-app messaging, and video consultations are
              coming in the next build.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {dietitians?.map((d) => (
          <Card key={d.id}>
            <CardContent className="flex items-center gap-3 p-4">
              <Avatar className="size-12">
                <AvatarFallback>{d.user.fullName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold">{d.user.fullName}</p>
                  {d.verified && <Badge>Verified</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{d.specializations.join(", ") || "General nutrition"}</p>
              </div>
              <span className="text-sm font-semibold">{formatNaira(d.pricePerSession)}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
