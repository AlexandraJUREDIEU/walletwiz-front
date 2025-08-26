import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import PageHeader from "@/components/system/PageHeader";
import EmptyState from "@/components/system/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Trash2, Link as LinkIcon } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import InviteDialog from "@/components/members/InviteDialog";
import RoleSelect from "@/components/members/RoleSelect";
import type { Member } from "@/types";

export default function MembersPage() {
  const { t } = useTranslation();
  const { currentSessionId, members, revokeMemberInvite, removeMember } = useMembers();

  const [openInvite, setOpenInvite] = useState(false);

  const hasSession = !!currentSessionId;
  const sorted = useMemo<Member[]>(() => {
    const list = [...members];
    // ACCEPTED first, then PENDING, then DECLINED; alphabetical by name/email
    const statusOrder = { ACCEPTED: 0, PENDING: 1, DECLINED: 2 } as const;
    list.sort((a, b) => {
      const sa = statusOrder[(a.invitationStatus ?? "ACCEPTED") as keyof typeof statusOrder] ?? 99;
      const sb = statusOrder[(b.invitationStatus ?? "ACCEPTED") as keyof typeof statusOrder] ?? 99;
      if (sa !== sb) return sa - sb;
      const na = (a.name ?? a.invitedEmail ?? a.userId ?? a.id).toLowerCase();
      const nb = (b.name ?? b.invitedEmail ?? b.userId ?? b.id).toLowerCase();
      return na.localeCompare(nb);
    });
    return list;
  }, [members]);

  function statusBadge(s?: Member["invitationStatus"]) {
    if (s === "PENDING") return <Badge variant="secondary">{t("members.status.pending")}</Badge>;
    if (s === "DECLINED") return <Badge variant="destructive">{t("members.status.declined")}</Badge>;
    return <Badge>{t("members.status.accepted")}</Badge>;
  }

  async function onRevoke(id: string) {
    await revokeMemberInvite(id);
    toast.success(t("members.toasts.revoked"));
  }
  async function onRemove(id: string) {
    try {
      await removeMember(id);
      toast.success(t("members.toasts.removed"));
    } catch (e: any) {
      if (e?.message === "lastOwner" || e?.message === "selfLastOwner") {
        toast.error(t("members.guards.lastOwner"));
      } else {
        toast.error(t("members.toasts.errorRemove"));
      }
    }
  }

  return (
    <section className="p-3 sm:p-4 lg:p-6 space-y-4">
      <PageHeader
        title={t("nav.members")}
        description={
          hasSession
            ? t("pages.common.sessionBound", { id: currentSessionId })
            : t("pages.common.noSession")
        }
        right={
          <Button onClick={() => setOpenInvite(true)} disabled={!hasSession}>
            {t("members.actions.invite")}
          </Button>
        }
      />

      {!hasSession ? (
        <EmptyState title={t("members.empty.noSessionTitle")} description={t("members.empty.noSessionDesc")} />
      ) : sorted.length === 0 ? (
        <EmptyState
          title={t("members.empty.title")}
          description={t("members.empty.desc")}
          actionLabel={t("members.actions.invite")}
          onAction={() => setOpenInvite(true)}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("members.table.member")}</TableHead>
                  <TableHead>{t("members.table.role")}</TableHead>
                  <TableHead>{t("members.table.status")}</TableHead>
                  <TableHead className="w-[220px]">{t("members.table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((m) => {
                  const display = m.name ?? m.invitedEmail ?? m.userId ?? m.id;
                  const canRevoke = m.invitationStatus === "PENDING";
                  const canRemove = m.invitationStatus === "ACCEPTED";
                  const canCopyLink = !!m.inviteToken && m.invitationStatus === "PENDING";

                  return (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{display}</TableCell>
                      <TableCell><RoleSelect member={m} /></TableCell>
                      <TableCell>{statusBadge(m.invitationStatus)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {canCopyLink && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                const url = `${window.location.origin}/invite/${m.inviteToken}`;
                                navigator.clipboard.writeText(url).then(() => toast.success(t("members.share.copied")));
                              }}
                            >
                              <LinkIcon className="h-4 w-4 mr-2" />
                              {t("members.share.copy")}
                            </Button>
                          )}
                          {canRevoke && (
                            <Button variant="outline" size="sm" onClick={() => onRevoke(m.id)}>
                              {t("members.actions.revoke")}
                            </Button>
                          )}
                          {canRemove && (
                            <Button variant="destructive" size="sm" onClick={() => onRemove(m.id)}>
                              <Trash2 className="h-4 w-4 mr-1" />
                              {t("members.actions.remove")}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <InviteDialog open={openInvite} onOpenChange={setOpenInvite} />
    </section>
  );
}
