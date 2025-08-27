import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: string | null;
  onSave: (notes: string | null) => Promise<void> | void;
  disabled?: boolean;
};

export default function EditNotesDialog({ open, onOpenChange, initial, onSave, disabled }: Props) {
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm<{ notes: string }>({
    defaultValues: { notes: initial ?? "" },
    values: { notes: initial ?? "" },
  });

  async function onSubmit(v: { notes: string }) {
    await onSave(v.notes.trim() === "" ? null : v.notes);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-w-[calc(100vw-1.5rem)]">
        <DialogHeader>
          <DialogTitle>{t("budgets.notes.title")}</DialogTitle>
          <DialogDescription>{t("budgets.notes.desc")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Textarea rows={5} placeholder={t("budgets.notes.placeholder") ?? ""} {...register("notes")} disabled={disabled} />
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={disabled}>
              {t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
