import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Pencil, Users, Trash2 } from "lucide-react";
import type { BankAccount } from "@/types";
import { useBankAccountsService } from "@/lib/service/bank-account.service";
import { useSessionStore } from "@/stores/sessionStore";

type Props = {
  account: BankAccount;
  onEdit: (acc: BankAccount) => void;
  onChanged: () => void; // refresh callback
};

export default function BankAccountCard({ account, onEdit, onChanged }: Props) {
  const { t } = useTranslation();
  const { update, addMember, removeMember } = useBankAccountsService();
  const { getCurrentMembers } = useSessionStore();

  const [selectedMemberId, setSelectedMemberId] = useState<string | undefined>(
    undefined
  );

  const membersInSession = getCurrentMembers();
  const attachedMemberIds = new Set(
    (account.members ?? []).map((m) => m.memberId)
  );
  const addableMembers = useMemo(
    () => membersInSession.filter((m) => !attachedMemberIds.has(m.id)),
    [membersInSession, attachedMemberIds]
  );

  async function toggleArchive(next: boolean) {
    try {
      await update(account.id, { isArchived: next });
      toast.success(
        next ? t("banks.toasts.archived") : t("banks.toasts.unarchived")
      );
      onChanged();
    } catch {}
  }

  async function onAddMember() {
    if (!selectedMemberId) return;
    try {
      await addMember(account.id, { memberId: selectedMemberId });
      toast.success(t("banks.toasts.memberAdded"));
      setSelectedMemberId(undefined);
      onChanged();
    } catch {}
  }

  async function onRemoveMember(mid: string) {
    try {
      await removeMember(account.id, mid);
      toast.success(t("banks.toasts.memberRemoved"));
      onChanged();
    } catch {}
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {account.label}
              {account.isArchived ? (
                <Badge variant="secondary">{t("banks.badges.archived")}</Badge>
              ) : null}
            </CardTitle>
            <CardDescription>
              {account.bankName || t("banks.misc.noBankName")}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(account)}
              aria-label={t("banks.actions.edit")}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {t("banks.actions.archive")}
              </span>
              <Switch
                checked={!!account.isArchived}
                onCheckedChange={toggleArchive}
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Balance indicative (si currentBalance non transmis, on fallback sur initial) */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-md border p-3">
            <div className="text-xs text-muted-foreground">
              {t("banks.fields.initialBalance")}
            </div>
            <div className="text-base font-medium">
              {(() => {
                const n = Number(account.initialBalance);
                return Number.isFinite(n) ? n.toFixed(2) : "0.00";
              })()}{" "}
              €
              </div>
          </div>
        </div>

        {/* Joint members */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <div className="text-sm font-medium">
              {t("banks.members.title")}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(account.members ?? []).map((m) => (
              <div
                key={m.memberId}
                className="flex items-center gap-2 rounded-md border px-2 py-1"
              >
                <span className="text-sm">
                  {m.member?.name ?? m.member?.invitedEmail ?? m.memberId}
                </span>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onRemoveMember(m.memberId)}
                  aria-label={t("banks.members.remove")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {(!account.members || account.members.length === 0) && (
              <div className="text-xs text-muted-foreground">
                {t("banks.members.empty")}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Select
              value={selectedMemberId}
              onValueChange={setSelectedMemberId}
            >
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder={t("banks.members.addPlaceholder")} />
              </SelectTrigger>
              <SelectContent className="max-h-[50vh]">
                {addableMembers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name ?? m.invitedEmail ?? m.id}
                  </SelectItem>
                ))}
                {addableMembers.length === 0 && (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    {t("banks.members.noMore")}
                  </div>
                )}
              </SelectContent>
            </Select>
            <Button onClick={onAddMember} disabled={!selectedMemberId}>
              {t("banks.members.add")}
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="text-[11px] text-muted-foreground">
          {t("banks.misc.id")}: {account.id}
        </div>
      </CardFooter>
    </Card>
  );
}
