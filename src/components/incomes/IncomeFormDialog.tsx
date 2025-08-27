import { useEffect } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import type { BankAccount, Member, Income } from "@/types";
import { useIncomesService } from "@/lib/service/income.service";

// ✅ schéma strict en number (pas de union string|number)
const schema = z.object({
  label: z.string().min(1, "Label requis"),
  amount: z.coerce.number().gt(0, "Montant invalide"),
  day: z.coerce.number().int().min(1, "Jour invalide").max(31, "Jour invalide"),
  bankAccountId: z.string().min(1, "Compte requis"),
  memberId: z.string().min(1, "Membre requis"),
});
type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit";
  sessionId: string;
  income?: Income | null;
  bankAccounts: BankAccount[];
  members: Member[];
  onSuccess?: () => void;
};

export default function IncomeFormDialog({
  open, onOpenChange, mode, sessionId, income, bankAccounts, members, onSuccess,
}: Props) {
  const { t } = useTranslation();
  const { create, update } = useIncomesService();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    // ✅ resolver typé explicitement sur FormValues
    resolver: zodResolver(schema) as any,
    defaultValues: {
      label: "",
      amount: 0,
      day: 1,
      bankAccountId: "",
      memberId: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && income) {
      const amountNum =
        typeof (income as any).amount === "number"
          ? (income as any).amount
          : Number(String((income as any).amount ?? "").replace(",", "."));
      reset({
        label: income.label,
        amount: Number.isFinite(amountNum) ? amountNum : 0,
        day: (income as any).day,
        bankAccountId: (income as any).bankAccountId,
        memberId: (income as any).memberId,
      });
    } else {
      reset({
        label: "",
        amount: 0,
        day: 1,
        bankAccountId: "",
        memberId: "",
      });
    }
  }, [open, mode, income, reset]);

  // ✅ handler typé : SubmitHandler<FormValues>
  const onSubmitForm: SubmitHandler<FormValues> = async (values) => {
    try {
      const payload = {
        sessionId,
        label: values.label,
        amount: String(values.amount.toFixed(2)), // API attend string
        day: values.day,
        bankAccountId: values.bankAccountId,
        memberId: values.memberId,
      };
      if (mode === "create") {
        await create(payload);
        toast.success(t("incomes.toasts.created"));
      } else if (income) {
        await update(income.id, payload);
        toast.success(t("incomes.toasts.updated"));
      }
      onOpenChange(false);
      onSuccess?.();
    } catch {
      /* erreurs toast via useApi */
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-w-[calc(100vw-1.5rem)]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? t("incomes.form.createTitle") : t("incomes.form.editTitle")}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" ? t("incomes.form.createDesc") : t("incomes.form.editDesc")}
          </DialogDescription>
        </DialogHeader>

        {/* ✅ note: handleSubmit reçoit un SubmitHandler<FormValues> */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("incomes.form.label")}</label>
            <Input className="h-9" {...register("label")} placeholder={t("incomes.form.labelPh") ?? ""} />
            {errors.label && <p className="text-xs text-destructive">{errors.label.message as any}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("incomes.form.amount")}</label>
              <Input className="h-9" inputMode="decimal" {...register("amount")} placeholder="0.00" />
              {errors.amount && <p className="text-xs text-destructive">{errors.amount.message as any}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("incomes.form.day")}</label>
              <Input className="h-9" inputMode="numeric" {...register("day")} placeholder="1" />
              {errors.day && <p className="text-xs text-destructive">{errors.day.message as any}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("incomes.form.bank")}</label>
              {/* ✅ Controller pour Select */}
              <Controller
                control={control}
                name="bankAccountId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder={t("incomes.form.bankPh")} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[60vh]">
                      {bankAccounts.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.bankAccountId && (
                <p className="text-xs text-destructive">{errors.bankAccountId.message as any}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("incomes.form.member")}</label>
            <Controller
              control={control}
              name="memberId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder={t("incomes.form.memberPh")} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[60vh]">
                    {members.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name ?? m.invitedEmail ?? m.userId ?? m.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.memberId && <p className="text-xs text-destructive">{errors.memberId.message as any}</p>}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
              {mode === "create" ? t("common.create") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
