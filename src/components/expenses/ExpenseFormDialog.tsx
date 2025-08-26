import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import type { BankAccount, Member, Expense } from "@/types";
import { useExpensesService } from "@/lib/service/expense.service";

const CATEGORY_OPTS: Expense["category"][] = [
  "HOUSING", "UTILITIES", "HEALTH", "FOOD", "TRANSPORT", "SUBSCRIPTIONS", "OTHER",
];

const schema = z.object({
  label: z.string().min(1, "Label requis"),
  amount: z.coerce.number().gt(0, "Montant invalide"),
  day: z.coerce.number().int().min(1, "Jour invalide").max(31, "Jour invalide"),
  bankAccountId: z.string().min(1, "Compte requis"),
  memberId: z.string().min(1, "Membre requis"),
  category: z.enum(["HOUSING","UTILITIES","HEALTH","FOOD","TRANSPORT","SUBSCRIPTIONS","OTHER"]),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit";
  sessionId: string;
  expense?: Expense | null;
  bankAccounts: BankAccount[];
  members: Member[];
  onSuccess?: () => void;
};

export default function ExpenseFormDialog({
  open, onOpenChange, mode, sessionId, expense, bankAccounts, members, onSuccess,
}: Props) {
  const { t } = useTranslation();
  const { create, update } = useExpensesService();

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
    if (mode === "edit" && expense) {
      const amountNum =
        typeof (expense as any).amount === "number"
          ? (expense as any).amount
          : Number(String((expense as any).amount ?? "").replace(",", "."));
      reset({
        label: expense.label,
        amount: Number.isFinite(amountNum) ? amountNum : 0,
        day: (expense as any).day,
        bankAccountId: (expense as any).bankAccountId,
        memberId: (expense as any).memberId,
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
  }, [open, mode, expense, reset]);

  async function onSubmit(v: FormValues) {
    try {
      const payload = {
        label: v.label,
        amount: String((v.amount as number).toFixed(2)), // API = string
        day: v.day,
        bankAccountId: v.bankAccountId,
        memberId: v.memberId,
        category: v.category,
      };
      if (mode === "create") {
        await create({ sessionId, ...payload });
        toast.success(t("expenses.toasts.created"));
      } else if (expense) {
        await update(expense.id, payload);
        toast.success(t("expenses.toasts.updated"));
      }
      onOpenChange(false);
      onSuccess?.();
    } catch {
      /* erreurs toast via useApi */
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-w-[calc(100vw-1.5rem)]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? t("expenses.form.createTitle") : t("expenses.form.editTitle")}</DialogTitle>
          <DialogDescription>{mode === "create" ? t("expenses.form.createDesc") : t("expenses.form.editDesc")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("expenses.form.label")}</label>
            <Input className="h-9" {...register("label")} placeholder={t("expenses.form.labelPh") ?? ""} />
            {errors.label && <p className="text-xs text-destructive">{errors.label.message as any}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("expenses.form.amount")}</label>
              <Input className="h-9" inputMode="decimal" {...register("amount")} placeholder="0.00" />
              {errors.amount && <p className="text-xs text-destructive">{errors.amount.message as any}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("expenses.form.day")}</label>
              <Input className="h-9" inputMode="numeric" {...register("day")} placeholder="1" />
              {errors.day && <p className="text-xs text-destructive">{errors.day.message as any}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("expenses.form.category")}</label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder={t("expenses.form.categoryPh")} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[60vh]">
                      {CATEGORY_OPTS.map((c) => (
                        <SelectItem key={c} value={c}>{t(`expenses.categories.${c.toLowerCase()}`)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("expenses.form.bank")}</label>
              <Controller
                control={control}
                name="bankAccountId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder={t("expenses.form.bankPh")} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[60vh]">
                      {bankAccounts.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("expenses.form.member")}</label>
              <Controller
                control={control}
                name="memberId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder={t("expenses.form.memberPh")} />
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
            </div>
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