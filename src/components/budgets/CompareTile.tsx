import { Card, CardContent } from "@/components/ui/card";

export default function CompareTile({
  title,
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
}: {
  title: string;
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{title}</div>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{leftLabel}</div>
            <div className="text-lg font-semibold">{leftValue}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{rightLabel}</div>
            <div className="text-lg font-semibold">{rightValue}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}