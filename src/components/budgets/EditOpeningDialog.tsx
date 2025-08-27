import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  amount: z.coerce
    .number()
    .refine((n) => Number.isFinite(n), "Montant invalide"), // supprime n >= 0
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: string;                 // "123.45"
  onSave: (amount: number) => Promise<void> | void;
  disabled?: boolean;
};

function toNumber(initial: string) {
  const n = Number(String(initial ?? "0").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export default function EditOpeningDialog({
  open, onOpenChange, initial, onSave, disabled,
}: Props) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { amount: toNumber(initial) },
  });

  // IMPORTANT : recharger la valeur au moment de l’ouverture (et si initial change)
  useEffect(() => {
    if (open) {
      reset({ amount: toNumber(initial) });
    }
  }, [open, initial, reset]);

  async function onSubmit(v: FormValues) {
    await onSave(v.amount);        // number ✔
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[calc(100vw-1.5rem)]">
        <DialogHeader>
          <DialogTitle>{t("budgets.opening.title")}</DialogTitle>
          <DialogDescription>{t("budgets.opening.desc")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">{t("budgets.opening.label")}</label>
            <Input
              className="h-9"
              inputMode="decimal"
              placeholder="0.00"
              {...register("amount")}
              disabled={disabled}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">{String(errors.amount.message)}</p>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting || disabled}>
              {t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}