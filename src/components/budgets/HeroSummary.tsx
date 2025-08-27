import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Row = { label: string; value: string; tone?: "good" | "bad" | "neutral" };

export default function HeroSummary({
  title,
  main,
  rows,
  tone = "neutral",
}: {
  title: string;
  main: string;
  rows: Row[];
  tone?: "good" | "bad" | "neutral";
}) {
  const mainTone =
    tone === "good" ? "text-emerald-600 dark:text-emerald-400"
    : tone === "bad" ? "text-rose-600 dark:text-rose-400"
    : "text-foreground";
  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{title}</div>
        <div className={cn("text-3xl sm:text-4xl font-semibold mt-1", mainTone)}>{main}</div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {rows.map((r, i) => {
            const toneCls = r.tone === "good" ? "text-emerald-600 dark:text-emerald-400"
              : r.tone === "bad" ? "text-rose-600 dark:text-rose-400"
              : "text-foreground";
            return (
              <div key={i} className="flex items-center justify-between rounded-md border p-2">
                <span className="text-xs text-muted-foreground">{r.label}</span>
                <span className={cn("text-sm font-medium", toneCls)}>{r.value}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

