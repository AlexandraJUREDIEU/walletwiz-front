import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/system/PageHeader";
import EmptyState from "@/components/system/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, RefreshCw } from "lucide-react";
import MonthPicker from "@/components/budgets/MonthPicker";
import TransactionFormDialog from "@/components/transactions/TransactionFormDialog";
import TransactionCardItem from "@/components/transactions/TransactionCardItem";
import { useTransactions } from "@/hooks/useTransactions";
import { useSessionStore } from "@/stores/sessionStore";
import { useBanks } from "@/hooks/useBanks";
import { useSessionService } from "@/lib/service/session.service";
import type { Transaction, TransactionCategory } from "@/types";

// utils
function fmtEUR(v: number | string, lang: string) {
  const n = typeof v === "number" ? v : Number(String(v).replace(",", "."));
  return new Intl.NumberFormat(lang, { style: "currency", currency: "EUR" }).format(Number.isFinite(n) ? n : 0);
}
function prevMonth(current: string, delta: -1 | 1) {
  const [y, m] = current.split("-").map(Number);
  const d = new Date(y, (m - 1) + delta, 1);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yy}-${mm}`;
}

type Option = { id: string; label: string };

// sentinelles interdites aux chaînes vides
const ANY = "__ANY__";

export default function TransactionsPage() {
  const { t, i18n } = useTranslation();
  const { currentSessionId } = useSessionStore();


  const {
    visible, loading, range, setMonth,
    bankAccountId, setBankAccountId,
    memberId, setMemberId,
    cleared, setCleared,
    query, setQuery,
    refresh, createTx, updateTx, toggleCleared, removeTx, totals
  } = useTransactions();

  // Comptes → options (filtrer ids vides)
  const { banks } = useBanks();
  const bankOptions: Option[] = (banks ?? [])
    .map((b: any) => ({ id: String(b.id ?? ""), label: b.label ?? b.bankName ?? String(b.id ?? "") }))
    .filter((o: Option) => o.id.trim().length > 0);

  // Membres → options (fetch via service; filtrer ids vides)
  const { getSessionMembers } = useSessionService();
  const getSessionMembersRef = useRef(getSessionMembers);
useEffect(() => {
  getSessionMembersRef.current = getSessionMembers;
}, [getSessionMembers]);

const [memberOptions, setMemberOptions] = useState<Option[]>([]);

useEffect(() => {
  let alive = true;
  async function loadMembers() {
    if (!currentSessionId) {
      setMemberOptions([]);
      return;
    }
    try {
      const ms = await getSessionMembersRef.current(currentSessionId);
      if (!alive) return;
      const opts = (ms ?? [])
        .map((m: any) => ({
          id: String(m.id ?? ""),
          label: m.name ?? m.invitedEmail ?? String(m.id ?? ""),
        }))
        .filter((o: Option) => o.id.trim().length > 0);
      setMemberOptions(opts);
    } catch {
      if (alive) setMemberOptions([]);
    }
  }
  void loadMembers();
  return () => {
    alive = false;
  };
  // 🔑 Dépend uniquement de la session (pas de la ref de fonction)
}, [currentSessionId]);

  // Dialogs
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Transaction | null>(null);

  // Delete confirm
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const hasSession = !!currentSessionId;
  const monthString = useMemo(() => range.from.slice(0, 7), [range.from]);

  function openCreate() {
    setMode("create");
    setEditing(null);
    setOpenForm(true);
  }
  function openEdit(tx: Transaction) {
    setMode("edit");
    setEditing(tx);
    setOpenForm(true);
  }

  return (
    <section className="p-3 sm:p-4 lg:p-6 space-y-4">
      <PageHeader
        title={t("nav.transactions")}
        description={hasSession ? t("pages.common.sessionBound", { id: currentSessionId }) : t("pages.common.noSession")}
        right={
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <MonthPicker
              month={monthString}
              onPrev={() => setMonth(prevMonth(monthString, -1))}
              onNext={() => setMonth(prevMonth(monthString, +1))}
              onChange={(m) => setMonth(m)}
              disabled={!hasSession}
            />
            <Button variant="default" onClick={openCreate} disabled={!hasSession}>
              <Plus className="h-4 w-4 mr-2" /> {t("tx.actions.new")}
            </Button>
            <Button variant="outline" onClick={() => refresh()} disabled={!hasSession || loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> {t("common.refresh")}
            </Button>
          </div>
        }
      />

      {!hasSession ? (
        <EmptyState title={t("tx.empty.noSessionTitle")} description={t("tx.empty.noSessionDesc")} />
      ) : (
        <>
          {/* Filtres */}
          <Card>
            <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Recherche */}
              <div className="space-y-1">
                <Label>{t("tx.filters.search")}</Label>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    className="h-9"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("tx.filters.searchPh") ?? ""}
                  />
                </div>
              </div>

              {/* Compte (sentinelle "__ANY__") */}
              <div className="space-y-1">
                <Label>{t("tx.filters.bank")}</Label>
                <Select
                  value={bankAccountId ?? ANY}
                  onValueChange={(v) => setBankAccountId(v === ANY ? null : v)}
                >
                  <SelectTrigger><SelectValue placeholder={t("tx.filters.bankPh") ?? ""} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ANY}>{t("tx.filters.any")}</SelectItem>
                    {bankOptions.map((o: Option) => (
                      <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Membre (sentinelle "__ANY__") */}
              <div className="space-y-1">
                <Label>{t("tx.filters.member")}</Label>
                <Select
                  value={memberId ?? ANY}
                  onValueChange={(v) => setMemberId(v === ANY ? null : v)}
                >
                  <SelectTrigger><SelectValue placeholder={t("tx.filters.memberPh") ?? ""} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ANY}>{t("tx.filters.any")}</SelectItem>
                    {memberOptions.map((o: Option) => (
                      <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cleared */}
              <div className="space-y-1">
                <Label>{t("tx.filters.cleared")}</Label>
                <Select value={cleared} onValueChange={(v) => setCleared(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{t("tx.filters.clearedAll")}</SelectItem>
                    <SelectItem value="CLEARED">{t("tx.filters.clearedYes")}</SelectItem>
                    <SelectItem value="UNCLEARED">{t("tx.filters.clearedNo")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Totaux */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">{t("tx.totals.in")}</div>
                <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                  {fmtEUR(totals.in, i18n.language)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">{t("tx.totals.out")}</div>
                <div className="text-lg font-semibold text-rose-600 dark:text-rose-400">
                  {fmtEUR(totals.out, i18n.language)}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-2 sm:col-span-1">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">{t("tx.totals.net")}</div>
                <div className={`text-lg font-semibold ${totals.in - totals.out >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                  {fmtEUR(totals.in - totals.out, i18n.language)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste MOBILE */}
          <div className="grid gap-3 sm:hidden">
            {visible.map((tx) => (
              <TransactionCardItem
                key={tx.id}
                tx={tx}
                fmt={(v) => (tx.type === "OUTFLOW" ? "-" : "+") + " " + fmtEUR(v, i18n.language)}
                onEdit={openEdit}
                onDelete={(t) => setConfirmId(t.id)}
                onToggleCleared={(t) => void toggleCleared(t.id, t.isCleared)}
              />
            ))}
            {visible.length === 0 && (
              <EmptyState title={t("tx.empty.title")} description={t("tx.empty.desc")} />
            )}
          </div>

          {/* Liste DESKTOP */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="text-left border-b">
                  <th className="py-2 pr-2">{t("tx.table.date")}</th>
                  <th className="py-2 pr-2">{t("tx.table.label")}</th>
                  <th className="py-2 pr-2">{t("tx.table.account")}</th>
                  <th className="py-2 pr-2">{t("tx.table.member")}</th>
                  <th className="py-2 pr-2">{t("tx.table.amount")}</th>
                  <th className="py-2 pr-2">{t("tx.table.category")}</th>
                  <th className="py-2 pr-2">{t("tx.table.cleared")}</th>
                  <th className="py-2 pr-2 w-[120px]">{t("tx.table.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((tx) => {
                  const isOut = tx.type === "OUTFLOW";
                  return (
                    <tr key={tx.id} className="border-b">
                      <td className="py-2 pr-2 whitespace-nowrap">{tx.date}</td>
                      <td className="py-2 pr-2">{tx.label}</td>
                      <td className="py-2 pr-2">{tx.bankAccountId}</td>
                      <td className="py-2 pr-2">{tx.memberId ?? "-"}</td>
                      <td className={`py-2 pr-2 font-medium whitespace-nowrap ${isOut ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                        {(isOut ? "-" : "+") + " " + fmtEUR(tx.amount, i18n.language)}
                      </td>
                      <td className="py-2 pr-2">{(tx as any).category ?? "-"}</td>
                      <td className="py-2 pr-2">
                        <Switch checked={!!tx.isCleared} onCheckedChange={() => void toggleCleared(tx.id, tx.isCleared)} />
                      </td>
                      <td className="py-2 pr-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(tx)}>{t("common.edit")}</Button>
                          <Button size="sm" variant="destructive" onClick={() => setConfirmId(tx.id)}>{t("common.delete")}</Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {visible.length === 0 && (
              <div className="py-6">
                <EmptyState title={t("tx.empty.title")} description={t("tx.empty.desc")} />
              </div>
            )}
          </div>
        </>
      )}

      {/* Dialog create/edit */}
      <TransactionFormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        mode={mode}
        initial={editing}
        bankOptions={bankOptions}
        memberOptions={memberOptions}
        onSubmit={async (v) => {
          const base = {
            type: v.type,
            date: v.date,
            label: v.label,
            amount: v.amount,
            bankAccountId: v.bankAccountId,
          };
          const optMember = v.memberId ? { memberId: v.memberId } : {};
          const optCategory = v.category ? { category: v.category as TransactionCategory } : {};
          const optNotes = v.notes ? { notes: v.notes } : {};

          if (mode === "create") {
            await createTx({ ...base, ...optMember, ...optCategory, ...optNotes });
          } else if (editing) {
            await updateTx(editing.id, { ...base, ...optMember, ...optCategory, ...optNotes });
          }
        }}
      />

      {/* Confirm delete */}
      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("tx.delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("tx.delete.desc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmId(null)}>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => { if (confirmId) await removeTx(confirmId); setConfirmId(null); }}>
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
