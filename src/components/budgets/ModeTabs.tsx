import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  value: "planned" | "actual" | "cleared";
  onChange: (v: "planned" | "actual" | "cleared") => void;
  disabled?: boolean;
};
export default function ModeTabs({ value, onChange, disabled }: Props) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as any)}>
      <TabsList className="grid grid-cols-3 w-full sm:w-auto">
        <TabsTrigger value="planned" disabled={disabled}>Planned</TabsTrigger>
        <TabsTrigger value="actual" disabled={disabled}>Actual</TabsTrigger>
        <TabsTrigger value="cleared" disabled={disabled}>Cleared</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}