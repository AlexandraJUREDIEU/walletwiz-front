import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};
export default function EmptyState({ title, description, actionLabel, onAction }: Props) {
  return (
    <div className="rounded-lg border p-4 sm:p-6 text-sm">
      <div className="space-y-2">
        <div className="text-sm sm:text-base font-medium">{title}</div>
        {description ? (
          <div className="text-xs sm:text-sm text-muted-foreground">{description}</div>
        ) : null}
        {actionLabel && onAction ? (
          <div className="pt-2">
            <Button onClick={onAction} className="h-9 sm:h-10">{actionLabel}</Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}