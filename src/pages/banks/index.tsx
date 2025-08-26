import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import PageHeader from "@/components/system/PageHeader";
import EmptyState from "@/components/system/EmptyState";
import { Button } from "@/components/ui/button";
import { useBanks } from "@/hooks/useBanks";
import type { BankAccount } from "@/types";
import BankAccountFormDialog from "@/components/banks/BankAccountFormDialog";
import BankAccountCard from "@/components/banks/BankAccountCard";

export default function BanksPage() {
  const { t } = useTranslation();
  const { banks, refresh, currentSessionId } = useBanks();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BankAccount | null>(null);

  const hasSession = !!currentSessionId;
  const sorted = useMemo(() => {
    const list = [...banks];
    list.sort((a, b) => {
      // non archivés d'abord, puis alpha
      if (!!a.isArchived !== !!b.isArchived) return a.isArchived ? 1 : -1;
      return a.label.localeCompare(b.label);
    });
    return list;
  }, [banks]);

  function onCreateClick() {
    setEditing(null);
    setOpen(true);
  }
  function onEditClick(acc: BankAccount) {
    setEditing(acc);
    setOpen(true);
  }

  return (
    <section className="p-3 sm:p-4 lg:p-6 space-y-4">
      <PageHeader
        title={t("nav.banks")}
        description={
          hasSession
            ? t("pages.common.sessionBound", { id: currentSessionId })
            : t("pages.common.noSession")
        }
        right={
          <Button onClick={onCreateClick} disabled={!hasSession}>
            <Plus className="h-4 w-4 mr-2" />
            {t("banks.actions.new")}
          </Button>
        }
      />

      {!hasSession ? (
        <EmptyState
          title={t("banks.empty.noSessionTitle")}
          description={t("banks.empty.noSessionDesc")}
        />
      ) : sorted.length === 0 ? (
        <EmptyState
          title={t("banks.empty.title")}
          description={t("banks.empty.desc")}
          actionLabel={t("banks.actions.new")}
          onAction={onCreateClick}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {sorted.map((acc) => (
            <BankAccountCard key={acc.id} account={acc} onEdit={onEditClick} onChanged={() => refresh()} />
          ))}
        </div>
      )}

      {/* Dialog créer/éditer */}
      {hasSession && (
        <BankAccountFormDialog
          open={open}
          onOpenChange={setOpen}
          mode={editing ? "edit" : "create"}
          sessionId={currentSessionId!}
          account={editing}
          onSuccess={() => refresh()}
        />
      )}
    </section>
  );
}