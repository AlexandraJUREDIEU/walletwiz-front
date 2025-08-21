import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { NavList } from "./NavList";

export function MobileSidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {/* Fullscreen, no border radius, no max-width constraint */}
      <DrawerContent
        className="
          p-0 h-dvh max-h-dvh w-screen max-w-none overflow-hidden rounded-none
          overscroll-contain touch-pan-y
        "
      >
        <div className="flex h-full flex-col">
          {/* Header fixe */}
          <DrawerHeader className="border-b shrink-0">
            <DrawerTitle className="h-display">WalletWiz</DrawerTitle>
          </DrawerHeader>

          {/* Zone centrale scrollable (évite le débordement) */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <NavList onNavigate={() => onOpenChange(false)} />
          </div>

          {/* Footer fixe + safe area iOS */}
          <div
            className="border-t p-3"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.5rem)" }}
          >
            <DrawerClose className="w-full rounded-md border px-3 py-2 text-sm hover:bg-muted">
              Close
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}