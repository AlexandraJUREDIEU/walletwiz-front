import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, ArchiveRestore, Archive } from "lucide-react";
import type { Expense, BankAccount, Member } from "@/types";
import { useTranslation } from "react-i18next";

function nfmt(v: string | number | null | undefined, lang: string) {
  const n = typeof v === "number" ? v : Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n)
    ? new Intl.NumberFormat(lang, { style: "currency", currency: "EUR" }).format(n)
    : "—";
}

export default function ExpenseCardItem({
  expense, bank, member, onEdit, onDelete, onToggleArchive,
}: {
  expense: Expense;
  bank?: BankAccount;
  member?: Member;
  onEdit: (e: Expense) => void;
  onDelete: (e: Expense) => void;
  onToggleArchive: (e: Expense) => void;
}) {
  const { t, i18n } = useTranslation();
  const amount = nfmt(expense.amount as any, i18n.language);

  return (
    <Card>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-medium truncate">{expense.label}</div>
            <div className="text-sm text-muted-foreground">
              {t("expenses.fields.day")} {expense.day} · {bank?.label ?? "—"} ·{" "}
              {member?.name ?? member?.invitedEmail ?? member?.userId ?? "—"}
            </div>
            <div className="mt-1">
              <Badge variant="secondary">{t(`expenses.categories.${expense.category.toLowerCase()}`)}</Badge>
              {expense.isArchived && <Badge className="ml-2" variant="outline">{t("expenses.badges.archived")}</Badge>}
            </div>
          </div>
          <div className="text-right font-medium">{amount}</div>
        </div>
        <div className="flex flex-col xs:flex-row gap-2">
          <Button variant="outline" size="sm" className="w-full xs:w-auto" onClick={() => onEdit(expense)}>
            <Pencil className="h-4 w-4 mr-2" /> {t("common.edit")}
          </Button>
          <Button variant="secondary" size="sm" className="w-full xs:w-auto" onClick={() => onToggleArchive(expense)}>
            {expense.isArchived ? <ArchiveRestore className="h-4 w-4 mr-2" /> : <Archive className="h-4 w-4 mr-2" />}
            {expense.isArchived ? t("expenses.actions.restore") : t("expenses.actions.archive")}
          </Button>
          <Button variant="destructive" size="sm" className="w-full xs:w-auto" onClick={() => onDelete(expense)}>
            <Trash2 className="h-4 w-4 mr-2" /> {t("common.delete")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}