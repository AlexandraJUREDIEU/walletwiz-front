export default function PageSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-3 sm:space-y-3">
      <div className="h-6 w-40 sm:w-56 rounded bg-muted animate-pulse" />
      <div className="h-4 w-48 sm:w-72 rounded bg-muted animate-pulse" />
      <div className="h-24 sm:h-32 w-full rounded bg-muted animate-pulse" />
    </div>
  );
}