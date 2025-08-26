import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/system/PageHeader";
import EmptyState from "@/components/system/EmptyState";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Archive, ArchiveRestore } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import ExpenseFormDialog from "@/components/expenses/ExpenseFormDialog";
import ExpenseCardItem from "@/components/expenses/ExpenseCardItem";
import { useExpenses } from "@/hooks/useExpenses";
import { useBanks } from "@/hooks/useBanks";
import { useSessionStore } from "@/stores/sessionStore";
import type { Expense } from "@/types";
import { useExpensesService } from "@/lib/service/expense.service";
import { toast } from "sonner";

function nfmt(v: string | number | null | undefined, lang: string) {
  const n = typeof v === "number" ? v : Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n)
    ? new Intl.NumberFormat(lang, { style: "currency", currency: "EUR" }).format(n)
    : "—";
}

export default function ExpensesPage() {
  const { t, i18n } = useTranslation();

  const { currentSessionId, visibleExpenses, showArchived, setShowArchived, refresh, archiveExpense, restoreExpense } = useExpenses();
  const { banks } = useBanks();
  const { getCurrentMembers } = useSessionStore();
  const members = getCurrentMembers();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Expense | null>(null);

  const { remove } = useExpensesService();

  const hasSession = !!currentSessionId;
  const list = visibleExpenses;

  const banksMap = useMemo(() => new Map(banks.map((b) => [b.id, b])), [banks]);
  const membersMap = useMemo(() => new Map(members.map((m) => [m.id, m])), [members]);

  function onCreateClick() {
    setEditing(null);
    setOpen(true);
  }
  function onEditClick(e: Expense) {
    setEditing(e);
    setOpen(true);
  }

  async function onConfirmDelete() {
    if (!confirmDelete) return;
    try {
      await remove(confirmDelete.id);
      toast.success(t("expenses.toasts.deleted"));
      setConfirmDelete(null);
      await refresh();
    } catch {}
  }

  async function onToggleArchive(e: Expense) {
    try {
      if (e.isArchived) {
        await restoreExpense(e.id);
      } else {
        await archiveExpense(e.id);
      }
      toast.success(e.isArchived ? t("expenses.toasts.restored") : t("expenses.toasts.archived"));
    } catch {}
  }

  return (
    <section className="p-3 sm:p-4 lg:p-6 space-y-4">
      <PageHeader
        title={t("nav.expenses")}
        description={hasSession ? t("pages.common.sessionBound", { id: currentSessionId }) : t("pages.common.noSession")}
        right={
          <div className="flex flex-wrap gap-2">
            <Button variant={showArchived ? "secondary" : "outline"} onClick={() => setShowArchived(!showArchived)} disabled={!hasSession}>
              {showArchived ? <ArchiveRestore className="h-4 w-4 mr-2" /> : <Archive className="h-4 w-4 mr-2" />}
              {showArchived ? t("expenses.actions.hideArchived") : t("expenses.actions.showArchived")}
            </Button>
            <Button onClick={onCreateClick} disabled={!hasSession}>
              <Plus className="h-4 w-4 mr-2" /> {t("expenses.actions.new")}
            </Button>
          </div>
        }
      />

      {!hasSession ? (
        <EmptyState title={t("expenses.empty.noSessionTitle")} description={t("expenses.empty.noSessionDesc")} />
      ) : list.length === 0 ? (
        <EmptyState
          title={t("expenses.empty.title")}
          description={t("expenses.empty.desc")}
          actionLabel={t("expenses.actions.new")}
          onAction={onCreateClick}
        />
      ) : (
        <>
          {/* Mobile cards */}
          <div className="grid gap-2 md:hidden">
            {list.map((e) => (
              <ExpenseCardItem
                key={e.id}
                expense={e}
                bank={banksMap.get(e.bankAccountId)}
                member={membersMap.get(e.memberId)}
                onEdit={onEditClick}
                onDelete={(x) => setConfirmDelete(x)}
                onToggleArchive={onToggleArchive}
              />
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-lg border">
            <Table className="min-w-[920px]">
              <TableHeader>
                <TableRow>
                  <TableHead>{t("expenses.table.day")}</TableHead>
                  <TableHead>{t("expenses.table.label")}</TableHead>
                  <TableHead>{t("expenses.table.amount")}</TableHead>
                  <TableHead>{t("expenses.table.category")}</TableHead>
                  <TableHead>{t("expenses.table.bank")}</TableHead>
                  <TableHead>{t("expenses.table.member")}</TableHead>
                  <TableHead className="w-[240px]">{t("expenses.table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((e) => {
                  const bank = banksMap.get(e.bankAccountId);
                  const member = membersMap.get(e.memberId);
                  return (
                    <TableRow key={e.id}>
                      <TableCell className="w-[80px]"><Badge variant="secondary">{e.day}</Badge></TableCell>
                      <TableCell className="font-medium">{e.label}{e.isArchived && <Badge className="ml-2" variant="outline">{t("expenses.badges.archived")}</Badge>}</TableCell>
                      <TableCell>{nfmt(e.amount as any, i18n.language)}</TableCell>
                      <TableCell><Badge variant="secondary">{t(`expenses.categories.${e.category.toLowerCase()}`)}</Badge></TableCell>
                      <TableCell>{bank?.label ?? "—"}</TableCell>
                      <TableCell>{member?.name ?? member?.invitedEmail ?? member?.userId ?? "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={() => onEditClick(e)}>
                            <Pencil className="h-4 w-4 mr-2" /> {t("common.edit")}
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => onToggleArchive(e)}>
                            {e.isArchived ? <ArchiveRestore className="h-4 w-4 mr-2" /> : <Archive className="h-4 w-4 mr-2" />}
                            {e.isArchived ? t("expenses.actions.restore") : t("expenses.actions.archive")}
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(e)}>
                            <Trash2 className="h-4 w-4 mr-2" /> {t("common.delete")}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Dialog create/edit */}
      {hasSession && (
        <ExpenseFormDialog
          open={open}
          onOpenChange={setOpen}
          mode={editing ? "edit" : "create"}
          sessionId={currentSessionId!}
          expense={editing}
          bankAccounts={banks}
          members={members}
          onSuccess={() => refresh()}
        />
      )}

      {/* Confirm delete */}
      <AlertDialog open={!!confirmDelete} onOpenChange={(v) => !v && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("expenses.delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("expenses.delete.desc", { label: confirmDelete?.label ?? "" })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={onConfirmDelete}>
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}