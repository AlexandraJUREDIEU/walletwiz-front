import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select";
import { useMembers } from "@/hooks/useMembers";
import type { Member } from "@/types";

type Props = {
  member: Member;
};

export default function RoleSelect({ member }: Props) {
  const { t } = useTranslation();
  const { changeMemberRole } = useMembers();
  const [value, setValue] = useState(member.role);

  async function onChange(next: Member["role"]) {
    try {
      setValue(next);
      await changeMemberRole(member.id, next);
      toast.success(t("members.toasts.roleChanged"));
    } catch (e: any) {
      setValue(member.role);
      if (e?.message === "lastOwner" || e?.message === "selfLastOwner") {
        toast.error(t("members.guards.lastOwner"));
      } else {
        toast.error(t("members.toasts.errorRole"));
      }
    }
  }

  return (
    <Select value={value} onValueChange={(v) => onChange(v as any)}>
      <SelectTrigger className="w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="OWNER">{t("members.roles.owner")}</SelectItem>
        <SelectItem value="COLLABORATOR">{t("members.roles.collaborator")}</SelectItem>
        <SelectItem value="VIEWER">{t("members.roles.viewer")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
