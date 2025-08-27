import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "@/components/system/PageHeader";
import EmptyState from "@/components/system/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { useTxUrlState } from "@/hooks/useTxUrlState";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  FiltersSkeleton,
  ListSkeleton,
  TableSkeleton,
} from "@/components/transactions/TransactionsSkeleton";
import { cn } from "@/lib/utils";

// utils
function fmtEUR(v: number | string, lang: string) {
  const n = typeof v === "number" ? v : Number(String(v).replace(",", "."));
  return new Intl.NumberFormat(lang, {
    style: "currency",
    currency: "EUR",
  }).format(Number.isFinite(n) ? n : 0);
}
function prevMonth(current: string, delta: -1 | 1) {
  const [y, m] = current.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
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
    visible,
    items,
    loading,
    range,
    setMonth,
    bankAccountId,
    setBankAccountId,
    memberId,
    setMemberId,
    cleared,
    setCleared,
    query,
    setQuery,
    refresh,
    createTx,
    updateTx,
    toggleCleared,
    removeTx,
    totals,
  } = useTransactions();

  // Comptes → options (filtrer ids vides)
  const { banks } = useBanks();
  const bankOptions: Option[] = (banks ?? [])
    .map((b: any) => ({
      id: String(b.id ?? ""),
      label: b.label ?? b.bankName ?? String(b.id ?? ""),
    }))
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

  function fmtDateISOToLocal(iso: string, lang: string) {
    // supporte "YYYY-MM-DD" ou ISO
    const d = iso?.length === 10 ? new Date(`${iso}T00:00:00`) : new Date(iso);
    return new Intl.DateTimeFormat(lang, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  }

  function clsAmount(isOut: boolean) {
    return isOut
      ? "text-rose-600 dark:text-rose-400"
      : "text-emerald-600 dark:text-emerald-400";
  }

  function categoryTone(cat?: string) {
    switch (cat) {
      case "FOOD":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300";
      case "HOUSING":
        return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300";
      case "UTILITIES":
        return "bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300";
      case "HEALTH":
        return "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300";
      case "TRANSPORT":
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300";
      case "SUBSCRIPTIONS":
        return "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-900/20 dark:text-fuchsia-300";
      default:
        return "bg-muted text-foreground/80";
    }
  }

  // maps id -> label
  const bankMap = useMemo(
    () => Object.fromEntries(bankOptions.map((b) => [b.id, b.label])),
    [bankOptions]
  );
  const memberMap = useMemo(
    () => Object.fromEntries(memberOptions.map((m) => [m.id, m.label])),
    [memberOptions]
  );

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

  // URL <-> état
  const [url, setUrl] = useTxUrlState({
    month: monthString,
    bank: bankAccountId ?? null,
    member: memberId ?? null,
    cleared,
    q: query,
  });

  // Champ de recherche "contrôlé" avec debounce
  const [queryInput, setQueryInput] = useState(query);
  const debouncedQuery = useDebouncedValue(queryInput, 350);

  // 1) À l’arrivée sur la page ou navigation Back/Forward : pousse URL -> états
  useEffect(() => {
    if (url.month && url.month !== monthString) setMonth(url.month);
    setBankAccountId(url.bank ?? null);
    setMemberId(url.member ?? null);
    setCleared(url.cleared);
    setQuery(url.q ?? "");
    setQueryInput(url.q ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url.month, url.bank, url.member, url.cleared, url.q]);

  // 2) Quand l’utilisateur change des filtres : états -> URL
  useEffect(() => {
    setUrl({
      month: monthString,
      bank: bankAccountId ?? null,
      member: memberId ?? null,
      cleared,
      q: debouncedQuery ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthString, bankAccountId, memberId, cleared, debouncedQuery]);

  // 3) Appliquer la recherche debounced au hook data
  useEffect(() => {
    setQuery(debouncedQuery ?? "");
  }, [debouncedQuery, setQuery]);

  function exportCsv(rows: Transaction[]) {
    const head = [
      "id",
      "date",
      "type",
      "label",
      "amount",
      "bankAccountId",
      "memberId",
      "category",
      "isCleared",
      "notes",
    ];
    const esc = (v: any) => {
      if (v === null || v === undefined) return "";
      const s = String(v).replace(/"/g, '""');
      return `"${s}"`;
    };
    const body = rows.map((r) =>
      [
        r.id,
        r.date,
        r.type,
        r.label,
        typeof r.amount === "number" ? r.amount.toFixed(2) : r.amount,
        r.bankAccountId,
        r.memberId ?? "",
        (r as any).category ?? "",
        r.isCleared ? "1" : "0",
        r.notes ?? "",
      ]
        .map(esc)
        .join(",")
    );
    const csv = [head.join(","), ...body].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
  function onKey(e: KeyboardEvent) {
    if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      const el = document.querySelector<HTMLInputElement>('input[placeholder*="Libellé"], input[placeholder*="Label"]');
      el?.focus();
    }
    if ((e.key === "n" || e.key === "N") && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      openCreate();
    }
  }
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="p-3 sm:p-4 lg:p-6 space-y-4">
      <PageHeader
        title={t("nav.transactions")}
        description={
          hasSession
            ? t("pages.common.sessionBound", { id: currentSessionId })
            : t("pages.common.noSession")
        }
        right={
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <MonthPicker
              month={monthString}
              onPrev={() => setMonth(prevMonth(monthString, -1))}
              onNext={() => setMonth(prevMonth(monthString, +1))}
              onChange={(m) => setMonth(m)}
              disabled={!hasSession}
            />
            <Button
              variant="default"
              onClick={openCreate}
              disabled={!hasSession}
            >
              <Plus className="h-4 w-4 mr-2" /> {t("tx.actions.new")}
            </Button>
            <Button
              variant="outline"
              onClick={() => refresh()}
              disabled={!hasSession || loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />{" "}
              {t("common.refresh")}
            </Button>
            <Button
              variant="outline"
              onClick={() => exportCsv(visible)}
              disabled={!hasSession || visible.length === 0}
            >
              CSV
            </Button>
          </div>
        }
      />

      {!hasSession ? (
        <EmptyState
          title={t("tx.empty.noSessionTitle")}
          description={t("tx.empty.noSessionDesc")}
        />
      ) : loading && items.length === 0 ? (
        <>
          <FiltersSkeleton />
          <div className="sm:hidden">
            <ListSkeleton />
          </div>
          <TableSkeleton />
        </>
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
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
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
                  <SelectTrigger>
                    <SelectValue placeholder={t("tx.filters.bankPh") ?? ""} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ANY}>{t("tx.filters.any")}</SelectItem>
                    {bankOptions.map((o: Option) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.label}
                      </SelectItem>
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
                  <SelectTrigger>
                    <SelectValue placeholder={t("tx.filters.memberPh") ?? ""} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ANY}>{t("tx.filters.any")}</SelectItem>
                    {memberOptions.map((o: Option) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cleared */}
              <div className="space-y-1">
                <Label>{t("tx.filters.cleared")}</Label>
                <Select
                  value={cleared}
                  onValueChange={(v) => setCleared(v as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">
                      {t("tx.filters.clearedAll")}
                    </SelectItem>
                    <SelectItem value="CLEARED">
                      {t("tx.filters.clearedYes")}
                    </SelectItem>
                    <SelectItem value="UNCLEARED">
                      {t("tx.filters.clearedNo")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Totaux */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            aria-live="polite"
          >
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">
                  {t("tx.totals.in")}
                </div>
                <div className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                  {fmtEUR(totals.in, i18n.language)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">
                  {t("tx.totals.out")}
                </div>
                <div className="text-lg font-semibold text-rose-600 dark:text-rose-400">
                  {fmtEUR(totals.out, i18n.language)}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-2 sm:col-span-1">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">
                  {t("tx.totals.net")}
                </div>
                <div
                  className={`text-lg font-semibold ${
                    totals.in - totals.out >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
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
      bankLabel={bankMap[tx.bankAccountId] ?? tx.bankAccountId}
      memberLabel={tx.memberId ? (memberMap[tx.memberId] ?? tx.memberId) : undefined}
      dateLabel={fmtDateISOToLocal(tx.date, i18n.language)}
    />
  ))}
  {visible.length === 0 && <EmptyState title={t("tx.empty.title")} description={t("tx.empty.desc")} />}
</div>


          {/* Liste DESKTOP */}
          <div className="hidden sm:block overflow-auto max-h-[60vh]">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground sticky top-0 bg-background z-10">
                <tr className="text-left border-b">
                  <th className="py-2 pr-2">{t("tx.table.date")}</th>
                  <th className="py-2 pr-2">{t("tx.table.label")}</th>
                  <th className="py-2 pr-2">{t("tx.table.account")}</th>
                  <th className="py-2 pr-2">{t("tx.table.member")}</th>
                  <th className="py-2 pr-2">{t("tx.table.amount")}</th>
                  <th className="py-2 pr-2">{t("tx.table.category")}</th>
                  <th className="py-2 pr-2">{t("tx.table.cleared")}</th>
                  <th className="py-2 pr-2 w-[120px]">
                    {t("tx.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((tx) => {
                  const isOut = tx.type === "OUTFLOW";
                  return (
                    <tr key={tx.id} className="border-b">
                      <td className="py-2 pr-2 whitespace-nowrap">
                        {fmtDateISOToLocal(tx.date, i18n.language)}
                      </td>
                      <td className="py-2 pr-2">{tx.label}</td>
                      <td className="py-2 pr-2">
                        {bankMap[tx.bankAccountId] ?? tx.bankAccountId}
                      </td>
                      <td className="py-2 pr-2">
                        {memberMap[tx.memberId ?? ""] ?? "-"}
                      </td>
                      <td
                        className={cn(
                          "py-2 pr-2 font-semibold whitespace-nowrap",
                          clsAmount(isOut)
                        )}
                      >
                        {(isOut ? "-" : "+") +
                          " " +
                          fmtEUR(tx.amount, i18n.language)}
                      </td>
                      <td className="py-2 pr-2">
                        {(tx as any).category ? (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${categoryTone(
                              (tx as any).category
                            )}`}
                          >
                            {(tx as any).category}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-2 pr-2">
                        <Switch
                          aria-label={t("tx.a11y.toggleCleared", {
                            label: tx.label,
                          })}
                          checked={!!tx.isCleared}
                          onCheckedChange={() =>
                            void toggleCleared(tx.id, tx.isCleared)
                          }
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <div className="flex gap-2 justify-end">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEdit(tx)}
                                >
                                  {t("common.edit")}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {t("common.edit")}
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setConfirmId(tx.id)}
                                >
                                  {t("common.delete")}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {t("common.delete")}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {visible.length === 0 && (
              <div className="py-6">
                <EmptyState
                  title={t("tx.empty.title")}
                  description={t("tx.empty.desc")}
                />
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
          const optCategory = v.category
            ? { category: v.category as TransactionCategory }
            : {};
          const optNotes = v.notes ? { notes: v.notes } : {};

          if (mode === "create") {
            await createTx({
              ...base,
              ...optMember,
              ...optCategory,
              ...optNotes,
            });
          } else if (editing) {
            await updateTx(editing.id, {
              ...base,
              ...optMember,
              ...optCategory,
              ...optNotes,
            });
          }
        }}
      />

      {/* Confirm delete */}
      <AlertDialog
        open={!!confirmId}
        onOpenChange={(o) => !o && setConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("tx.delete.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("tx.delete.desc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmId(null)}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (confirmId) await removeTx(confirmId);
                setConfirmId(null);
              }}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}


