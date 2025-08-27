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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Transaction, TransactionCategory, TransactionType } from "@/types";

const schema = z.object({
  type: z.enum(["INFLOW", "OUTFLOW"] as const),
  date: z.string().min(10, "Date invalide"),
  label: z.string().trim().min(1, "Libellé requis"),
  amount: z.coerce.number().positive("Montant > 0"),
  bankAccountId: z.string().min(1, "Compte requis"),
  memberId: z.string().optional().or(z.literal("")),
  notes: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
});
type FormValues = z.infer<typeof schema>;
type Option = { id: string; label: string };

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "create" | "edit";
  initial?: Partial<Transaction> | null;
  bankOptions: Option[];
  memberOptions?: Option[];
  onSubmit: (values: Omit<FormValues, "memberId" | "category" | "notes"> & {
    memberId?: string | null;
    category?: TransactionCategory | null;
    notes?: string | null;
  }) => Promise<void> | void;
  disabled?: boolean;
};

// sentinelles
const NONE = "__NONE__";
const NO_BANK = "__NO_BANK__";

export default function TransactionFormDialog({
  open, onOpenChange, mode, initial, bankOptions, memberOptions = [], onSubmit, disabled
}: Props) {
  const { t } = useTranslation();

  const safeBanks = (bankOptions ?? []).filter(o => o.id && o.id.trim() !== "");
  const firstBank = safeBanks[0]?.id ?? NO_BANK;

const {
  register, handleSubmit, reset, setValue, watch,
  formState: { errors, isSubmitting }
} = useForm<FormValues>({
  resolver: zodResolver(schema) as any,
  defaultValues: {
    type: (initial?.type as TransactionType) ?? "OUTFLOW",
    date: initial?.date ?? new Date().toISOString().slice(0, 10),
    label: initial?.label ?? "",
    amount: typeof initial?.amount === "number"
      ? initial?.amount
      : Number(String(initial?.amount ?? "0").replace(",", ".")),
    bankAccountId: initial?.bankAccountId ?? firstBank,
    memberId: initial?.memberId ?? "",
    notes: initial?.notes ?? "",
    category: (initial as any)?.category ?? "",
  },
});

  // Re-populate à l’ouverture (ou changement initial)
useEffect(() => {
  if (!open) return;
  reset({
    type: (initial?.type as TransactionType) ?? "OUTFLOW",
    date: initial?.date ?? new Date().toISOString().slice(0, 10),
    label: initial?.label ?? "",
    amount: typeof initial?.amount === "number"
      ? initial?.amount
      : Number(String(initial?.amount ?? "0").replace(",", ".")),
    bankAccountId: initial?.bankAccountId ?? firstBank,
    memberId: initial?.memberId ?? "",
    notes: initial?.notes ?? "",
    category: (initial as any)?.category ?? "",
  });
}, [open, initial?.id]);

  const type = watch("type");

  async function onSubmitInternal(v: FormValues) {
    await onSubmit({
      ...v,
      memberId: v.memberId ? v.memberId : undefined,
      category: (v.category as TransactionCategory) || undefined,
      notes: v.notes ?? undefined,
    });
    onOpenChange(false);
  }

  const bankVal = watch("bankAccountId") || firstBank;
  const memberVal = (watch("memberId") || "") as string;
  const categoryVal = (watch("category") || "") as string;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-w-[calc(100vw-1.5rem)]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? t("tx.form.titleCreate") : t("tx.form.titleEdit")}
          </DialogTitle>
          <DialogDescription>{t("tx.form.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitInternal)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Type */}
          <div className="space-y-1">
            <Label>{t("tx.form.type")}</Label>
            <Select
              value={watch("type")}
              onValueChange={(val) => setValue("type", val as any)}
              disabled={disabled}
            >
              <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="INFLOW">{t("tx.types.inflow")}</SelectItem>
                <SelectItem value="OUTFLOW">{t("tx.types.outflow")}</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-xs text-destructive">{String(errors.type.message)}</p>}
          </div>

          {/* Date */}
          <div className="space-y-1">
            <Label>{t("tx.form.date")}</Label>
            <Input type="date" className="h-9" disabled={disabled} {...register("date")} />
            {errors.date && <p className="text-xs text-destructive">{String(errors.date.message)}</p>}
          </div>

          {/* Libellé */}
          <div className="space-y-1 sm:col-span-2">
            <Label>{t("tx.form.label")}</Label>
            <Input className="h-9" placeholder={t("tx.form.labelPh") ?? ""} disabled={disabled} {...register("label")} />
            {errors.label && <p className="text-xs text-destructive">{String(errors.label.message)}</p>}
          </div>

          {/* Montant */}
          <div className="space-y-1">
            <Label>{t("tx.form.amount")}</Label>
            <Input className="h-9" inputMode="decimal" placeholder="0.00" disabled={disabled} {...register("amount")} />
            {errors.amount && <p className="text-xs text-destructive">{String(errors.amount.message)}</p>}
          </div>

          {/* Compte bancaire (aucune valeur vide; fallback NO_BANK désactivé) */}
          <div className="space-y-1">
            <Label>{t("tx.form.bank")}</Label>
            <Select
              value={bankVal}
              onValueChange={(val) => setValue("bankAccountId", val)}
              disabled={disabled || safeBanks.length === 0}
            >
              <SelectTrigger><SelectValue placeholder={t("tx.form.bankPh") ?? ""} /></SelectTrigger>
              <SelectContent>
                {safeBanks.length === 0 ? (
                  <SelectItem value={NO_BANK} disabled>{t("tx.form.bankPh") ?? "Aucun compte disponible"}</SelectItem>
                ) : (
                  safeBanks.map((o) => <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)
                )}
              </SelectContent>
            </Select>
            {errors.bankAccountId && <p className="text-xs text-destructive">{String(errors.bankAccountId.message)}</p>}
          </div>

          {/* Membre (sentinelle NONE) */}
          <div className="space-y-1">
            <Label>{t("tx.form.member")}</Label>
            <Select
              value={memberVal || NONE}
              onValueChange={(val) => setValue("memberId", val === NONE ? "" : val)}
              disabled={disabled || (memberOptions ?? []).length === 0}
            >
              <SelectTrigger><SelectValue placeholder={t("tx.form.memberPh") ?? ""} /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>{t("tx.form.memberNone")}</SelectItem>
                {(memberOptions ?? []).filter(o => o.id && o.id.trim() !== "").map((o) => (
                  <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Catégorie (sentinelle NONE, activée si OUTFLOW) */}
          <div className="space-y-1">
            <Label>{t("tx.form.category")}</Label>
            <Select
              value={categoryVal || NONE}
              onValueChange={(val) => setValue("category", val === NONE ? "" : val)}
              disabled={disabled || type !== "OUTFLOW"}
            >
              <SelectTrigger><SelectValue placeholder={t("tx.form.categoryPh") ?? ""} /></SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>{t("tx.form.categoryNone")}</SelectItem>
                <SelectItem value="FOOD">{t("categories.FOOD")}</SelectItem>
                <SelectItem value="HOUSING">{t("categories.HOUSING")}</SelectItem>
                <SelectItem value="UTILITIES">{t("categories.UTILITIES")}</SelectItem>
                <SelectItem value="HEALTH">{t("categories.HEALTH")}</SelectItem>
                <SelectItem value="TRANSPORT">{t("categories.TRANSPORT")}</SelectItem>
                <SelectItem value="SUBSCRIPTIONS">{t("categories.SUBSCRIPTIONS")}</SelectItem>
                <SelectItem value="OTHER">{t("categories.OTHER")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-1 sm:col-span-2">
            <Label>{t("tx.form.notes")}</Label>
            <Textarea rows={3} disabled={disabled} {...register("notes")} />
          </div>

          <DialogFooter className="sm:col-span-2 flex flex-col sm:flex-row gap-2">
            <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting || disabled}>
              {mode === "create" ? t("common.create") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
