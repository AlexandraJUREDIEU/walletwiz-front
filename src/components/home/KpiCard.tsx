import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type Tone = "good" | "bad" | "neutral";

export function KpiCard({
  title,
  value,
  hint,
  tone = "neutral",
  className,
}: {
  title: string;
  value: string;
  hint?: string;
  tone?: Tone;
  className?: string;
}) {
  const toneClass =
    tone === "good"
      ? "text-emerald-700"
      : tone === "bad"
      ? "text-red-700"
      : "text-foreground";
  const hintClass =
    tone === "good"
      ? "text-emerald-600/70"
      : tone === "bad"
      ? "text-red-600/70"
      : "text-muted-foreground";

  return (
    <Card className={cn("p-4 md:p-5", className)}>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {title}
      </div>
      <div className={cn("mt-1 text-2xl font-semibold", toneClass)}>{value}</div>
      {hint ? <div className={cn("mt-1 text-xs", hintClass)}>{hint}</div> : null}
    </Card>
  );
}
