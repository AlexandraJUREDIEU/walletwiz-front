import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Income, BankAccount, Member } from "@/types";
import { useTranslation } from "react-i18next";

function toNumberSafely(v: string | number | null | undefined) {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v.replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
}

export default function IncomeCardItem({
  income,
  bank,
  member,
  onEdit,
  onDelete,
}: {
  income: Income;
  bank?: BankAccount;
  member?: Member;
  onEdit: (inc: Income) => void;
  onDelete: (inc: Income) => void;
}) {
  const { i18n, t } = useTranslation();

  const n = toNumberSafely((income as any).amount);
  const amount = new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);

  return (
    <Card>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-medium truncate">{income.label}</div>
            <div className="text-sm text-muted-foreground">
              {t("incomes.fields.day")} {income.day} · {bank?.label ?? "—"} ·{" "}
              {member?.name ?? member?.invitedEmail ?? member?.userId ?? "—"}
            </div>
          </div>
          <div className="text-right font-medium">{amount}</div>
        </div>
        <div className="flex flex-col xs:flex-row gap-2">
          <Button variant="outline" size="sm" className="w-full xs:w-auto" onClick={() => onEdit(income)}>
            <Pencil className="h-4 w-4 mr-2" />
            {t("common.edit")}
          </Button>
          <Button variant="destructive" size="sm" className="w-full xs:w-auto" onClick={() => onDelete(income)}>
            <Trash2 className="h-4 w-4 mr-2" />
            {t("common.delete")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
