type Props = {
  title: string;
  description?: string;
  right?: React.ReactNode;
};
export default function PageHeader({ title, description, right }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold">{title}</h1>
        {description ? (
          <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}