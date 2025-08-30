import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TxClearedPendingPlaceholder() {
  return (
    <Card className="p-4 md:p-5">
      <h3 className="text-sm font-medium">Pointage bancaire</h3>
      <div className="mt-3 grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-muted-foreground">Cleared</div>
          <Skeleton className="mt-1 h-6 w-10" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Pending</div>
          <Skeleton className="mt-1 h-6 w-10" />
        </div>
      </div>
    </Card>
  );
}
