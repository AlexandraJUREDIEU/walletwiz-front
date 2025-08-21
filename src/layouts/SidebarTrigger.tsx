import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function SidebarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" size="icon" className="md:hidden" onClick={onClick} aria-label="Open menu">
      <Menu className="h-5 w-5" />
    </Button>
  );
}