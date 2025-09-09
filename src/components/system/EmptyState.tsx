import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode; // ✅ nouveau
};

export default function EmptyState({ title, description, icon, className, children }: Props) {
  return (
    <div className={cn(
      "border border-dashed rounded-lg p-6 sm:p-8 text-center flex flex-col items-center gap-2",
      className
    )}>
      {icon ? <div className="mb-1">{icon}</div> : null}
      <h3 className="text-base font-semibold">{title}</h3>
      {description ? <p className="text-sm text-muted-foreground max-w-prose">{description}</p> : null}
      {children ? <div className="mt-2">{children}</div> : null}
    </div>
  );
}