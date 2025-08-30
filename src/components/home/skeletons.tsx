import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function KpiSkeleton() {
  return (
    <Card className="p-4 md:p-5">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-2 h-7 w-28" />
      <Skeleton className="mt-2 h-3 w-20" />
    </Card>
  );
}