import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Link as LinkIcon } from "lucide-react";
import RoleSelect from "./RoleSelect";
import type { Member } from "@/types";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

type Props = {
  member: Member;
  onRevoke: (id: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
};

export default function MemberCardItem({ member, onRevoke, onRemove }: Props) {
  const { t } = useTranslation();

  const display = member.name ?? member.invitedEmail ?? member.userId ?? member.id;
  const canRevoke = member.invitationStatus === "PENDING";
  const canRemove = member.invitationStatus === "ACCEPTED";
  const canCopyLink = !!member.inviteToken && member.invitationStatus === "PENDING";

  function statusBadge(s?: Member["invitationStatus"]) {
    if (s === "PENDING") return <Badge variant="secondary">{t("members.status.pending")}</Badge>;
    if (s === "DECLINED") return <Badge variant="destructive">{t("members.status.declined")}</Badge>;
    return <Badge>{t("members.status.accepted")}</Badge>;
  }

  return (
    <Card>
      <CardContent className="p-3 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-medium truncate">{display}</div>
            <div className="mt-1">{statusBadge(member.invitationStatus)}</div>
          </div>
          <div className="w-36">
            <RoleSelect member={member} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
          {canCopyLink && (
            <Button
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => {
                const url = `${window.location.origin}/invite/${member.inviteToken}`;
                navigator.clipboard.writeText(url).then(() => toast.success(t("members.share.copied")));
              }}
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              {t("members.share.copy")}
            </Button>
          )}
          {canRevoke && (
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => onRevoke(member.id)}>
              {t("members.actions.revoke")}
            </Button>
          )}
          {canRemove && (
            <Button variant="destructive" size="sm" className="w-full sm:w-auto" onClick={() => onRemove(member.id)}>
              <Trash2 className="h-4 w-4 mr-1" />
              {t("members.actions.remove")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
