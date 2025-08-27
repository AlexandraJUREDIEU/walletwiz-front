import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "good" | "bad";
};

export default function KpiCard({ label, value, hint, tone = "neutral" }: Props) {
  const toneCls =
    tone === "good" ? "text-emerald-600 dark:text-emerald-400"
    : tone === "bad" ? "text-rose-600 dark:text-rose-400"
    : "text-foreground";
  const hintCls =
    tone === "good" ? "text-emerald-600/70 dark:text-emerald-400/80"
    : tone === "bad" ? "text-rose-600/70 dark:text-rose-400/80"
    : "text-muted-foreground";
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className={cn("text-xl font-semibold mt-1", toneCls)}>{value}</div>
        {hint ? <div className={cn("text-xs mt-1", hintCls)}>{hint}</div> : null}
      </CardContent>
    </Card>
  );
}