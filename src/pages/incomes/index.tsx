import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/system/PageHeader";
import EmptyState from "@/components/system/EmptyState";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import IncomeFormDialog from "@/components/incomes/IncomeFormDialog";
import IncomeCardItem from "@/components/incomes/IncomeCardItem";
import { useIncomes } from "@/hooks/useIncomes"; // ← hook Étape 1 (session-aware)
import { useBanks } from "@/hooks/useBanks";     // pour les selects
import { useSessionStore } from "@/stores/sessionStore"; // pour les membres courant
import type { Income } from "@/types";
import { useIncomesService } from "@/lib/service/income.service";
import { toast } from "sonner";

function sortIncomes(list: Income[]) {
  const copy = [...list];
  copy.sort((a: any, b: any) => {
    if (a.day !== b.day) return a.day - b.day;
    return String(a.label).localeCompare(String(b.label));
  });
  return copy;
}

export default function IncomesPage() {
  const { t, i18n } = useTranslation();

  const { currentSessionId, incomes, refresh } = useIncomes();
  const { banks } = useBanks();
  const { getCurrentMembers } = useSessionStore();
  const members = getCurrentMembers();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Income | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Income | null>(null);

  const { remove } = useIncomesService();

  const hasSession = !!currentSessionId;
  const sorted = useMemo(() => sortIncomes(incomes as any), [incomes]);

  const banksMap = useMemo(() => new Map(banks.map((b) => [b.id, b])), [banks]);
  const membersMap = useMemo(() => new Map(members.map((m) => [m.id, m])), [members]);

  function onCreateClick() {
    setEditing(null);
    setOpen(true);
  }
  function onEditClick(inc: Income) {
    setEditing(inc);
    setOpen(true);
  }

  async function onConfirmDelete() {
    if (!confirmDelete) return;
    try {
      await remove((confirmDelete as any).id);
      toast.success(t("incomes.toasts.deleted"));
      setConfirmDelete(null);
      await refresh();
    } catch {
      /* toast via useApi */
    }
  }

  return (
    <section className="p-3 sm:p-4 lg:p-6 space-y-4">
      <PageHeader
        title={t("nav.incomes")}
        description={
          hasSession
            ? t("pages.common.sessionBound", { id: currentSessionId })
            : t("pages.common.noSession")
        }
        right={
          <Button onClick={onCreateClick} disabled={!hasSession}>
            <Plus className="h-4 w-4 mr-2" />
            {t("incomes.actions.new")}
          </Button>
        }
      />

      {!hasSession ? (
        <EmptyState title={t("incomes.empty.noSessionTitle")} description={t("incomes.empty.noSessionDesc")} />
      ) : sorted.length === 0 ? (
        <EmptyState
          title={t("incomes.empty.title")}
          description={t("incomes.empty.desc")}
          actionLabel={t("incomes.actions.new")}
          onAction={onCreateClick}
        />
      ) : (
        <>
          {/* Mobile cards */}
          <div className="grid gap-2 md:hidden">
            {sorted.map((inc: any) => (
              <IncomeCardItem
                key={inc.id}
                income={inc}
                bank={banksMap.get(inc.bankAccountId)}
                member={membersMap.get(inc.memberId)}
                onEdit={onEditClick}
                onDelete={(i) => setConfirmDelete(i)}
              />
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-lg border">
            <Table className="min-w-[820px]">
              <TableHeader>
                <TableRow>
                  <TableHead>{t("incomes.table.day")}</TableHead>
                  <TableHead>{t("incomes.table.label")}</TableHead>
                  <TableHead>{t("incomes.table.amount")}</TableHead>
                  <TableHead>{t("incomes.table.bank")}</TableHead>
                  <TableHead>{t("incomes.table.member")}</TableHead>
                  <TableHead className="w-[160px]">{t("incomes.table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((inc: any) => {
                  const bank = banksMap.get(inc.bankAccountId);
                  const member = membersMap.get(inc.memberId);
                  const amount = (() => {
                    const v = typeof inc.amount === "number" ? inc.amount : Number(String(inc.amount ?? "").replace(",", "."));
                    return Number.isFinite(v)
                      ? new Intl.NumberFormat(i18n.language, { style: "currency", currency: "EUR" }).format(v)
                      : "—";
                  })();
                  return (
                    <TableRow key={inc.id}>
                      <TableCell className="w-[80px]">
                        <Badge variant="secondary">{inc.day}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{inc.label}</TableCell>
                      <TableCell>{amount}</TableCell>
                      <TableCell>{bank?.label ?? "—"}</TableCell>
                      <TableCell>{member?.name ?? member?.invitedEmail ?? member?.userId ?? "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={() => onEditClick(inc)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            {t("common.edit")}
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(inc)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t("common.delete")}
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
        <IncomeFormDialog
          open={open}
          onOpenChange={setOpen}
          mode={editing ? "edit" : "create"}
          sessionId={currentSessionId!}
          income={editing}
          bankAccounts={banks}
          members={members}
          onSuccess={() => refresh()}
        />
      )}

      {/* Confirm delete */}
      <AlertDialog open={!!confirmDelete} onOpenChange={(v) => !v && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("incomes.delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("incomes.delete.desc", { label: confirmDelete?.label ?? "" })}
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
