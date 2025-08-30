import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentTransactionsPlaceholder() {
  return (
    <Card className="p-4 md:p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Transactions récentes</h3>
        <Button variant="ghost" size="sm">Voir tout</Button>
      </div>
      <div className="mt-3 space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </Card>
  );
}
