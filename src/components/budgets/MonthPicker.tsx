import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  month: string; // "YYYY-MM"
  onPrev: () => void;
  onNext: () => void;
  onChange: (m: string) => void;
  disabled?: boolean;
};

export default function MonthPicker({ month, onPrev, onNext, onChange, disabled }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={onPrev} disabled={disabled}><ChevronLeft className="h-4 w-4" /></Button>
      <Input
        type="month"
        className="h-9 w-[11.5rem]"
        value={month}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <Button variant="outline" size="icon" onClick={onNext} disabled={disabled}><ChevronRight className="h-4 w-4" /></Button>
    </div>
  );
}