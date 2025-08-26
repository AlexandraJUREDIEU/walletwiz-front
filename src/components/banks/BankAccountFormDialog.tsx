// src/components/banks/BankAccountFormDialog.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BankAccount, CreateBankAccountDto, UpdateBankAccountDto } from "@/types";
import { useBankAccountsService } from "@/lib/service/bank-account.service";

// 🔑 Schéma Zod : on garde initialBalance en STRING côté form (input)
const schema = z.object({
  label: z.string().min(1, "Label requis"),
  bankName: z.string().optional(),
  initialBalance: z
    .string()
    .optional()
    .refine(
      (v) => {
        if (!v || v.trim() === "") return true;
        const n = Number(v.replace(",", "."));
        return !Number.isNaN(n) && n >= 0;
      },
      "Doit être un nombre ≥ 0"
    ),
});

// 🔑 Le form est typé sur l'INPUT du schéma ➜ pas de conflit avec le resolver
type FormValues = z.input<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit";
  sessionId: string;
  account?: BankAccount | null;
  onSuccess?: () => void;
};

export default function BankAccountFormDialog({
  open,
  onOpenChange,
  mode,
  sessionId,
  account,
  onSuccess,
}: Props) {
  const { t } = useTranslation();
  const { create, update } = useBankAccountsService();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { label: "", bankName: "", initialBalance: "" },
  });

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && account) {
      setValue("label", account.label);
      setValue("bankName", account.bankName ?? "");
      // on garde une string dans le champ
      setValue(
        "initialBalance",
        typeof account.initialBalance === "number" ? account.initialBalance.toString() : ""
      );
    } else {
      reset({ label: "", bankName: "", initialBalance: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, account]);

  async function onSubmit(values: FormValues) {
    // Conversion sûre -> number | undefined
    const initial =
      values.initialBalance && values.initialBalance.trim() !== ""
        ? Number(values.initialBalance.replace(",", "."))
        : undefined;

    try {
      if (mode === "create") {
        const payload: CreateBankAccountDto = {
          sessionId,
          label: values.label,
          bankName: values.bankName ?? "",
          initialBalance: initial,
          isArchived: false,
        };
        await create(payload);
        toast.success(t("banks.toasts.created"));
      } else if (account) {
        const payload: UpdateBankAccountDto = {
          label: values.label,
          bankName: values.bankName ?? null,
          initialBalance: initial,
        };
        await update(account.id, payload);
        toast.success(t("banks.toasts.updated"));
      }
      onOpenChange(false);
      onSuccess?.();
    } catch {
      // erreurs toastées par useApi
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? t("banks.form.createTitle") : t("banks.form.editTitle")}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" ? t("banks.form.createDesc") : t("banks.form.editDesc")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("banks.form.label")}</label>
            <Input {...register("label")} placeholder={t("banks.form.labelPh") ?? ""} />
            {errors.label && <p className="text-xs text-destructive">{errors.label.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("banks.form.bankName")}</label>
            <Input {...register("bankName")} placeholder={t("banks.form.bankNamePh") ?? ""} />
            {errors.bankName && (
              <p className="text-xs text-destructive">{errors.bankName.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("banks.form.initialBalance")}</label>
            <Input {...register("initialBalance")} placeholder="0.00" inputMode="decimal" />
            {errors.initialBalance && (
              <p className="text-xs text-destructive">{errors.initialBalance.message as string}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {mode === "create" ? t("common.create") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
