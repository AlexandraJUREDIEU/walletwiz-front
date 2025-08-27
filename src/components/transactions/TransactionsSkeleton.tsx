// src/components/transactions/TransactionsSkeleton.tsx
import { Card, CardContent } from "@/components/ui/card";

export function FiltersSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-9 w-full bg-muted rounded" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-4 w-40 bg-muted rounded" />
              <div className="h-5 w-24 bg-muted rounded" />
            </div>
            <div className="h-3 w-28 bg-muted rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="hidden sm:block">
      <div className="h-7 w-full bg-muted rounded mb-2" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-10 w-full bg-muted/70 rounded mb-2" />
      ))}
    </div>
  );
}
