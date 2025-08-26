import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs, TabsList, TabsTrigger, TabsContent
} from "@/components/ui/tabs";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select";
import { useMembers } from "@/hooks/useMembers";
import { Copy, ExternalLink } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export default function InviteDialog({ open, onOpenChange }: Props) {
  const { t } = useTranslation();
  const {
    inviteExisting, invitePlaceholder, inviteWithLink,
  } = useMembers();

  const [tab, setTab] = useState<"existing" | "placeholder" | "link">("link");
  const [role, setRole] = useState<"OWNER" | "COLLABORATOR" | "VIEWER">("VIEWER");

  // forms
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [emailMemo, setEmailMemo] = useState("");
  const [shareLink, setShareLink] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!open) {
      setTab("link");
      setRole("VIEWER");
      setUserId("");
      setName("");
      setEmailMemo("");
      setShareLink(undefined);
    }
  }, [open]);

  async function onInviteExisting() {
    if (!userId.trim()) return toast.error(t("members.form.userIdRequired"));
    await inviteExisting(userId.trim(), role);
    toast.success(t("members.toasts.invited"));
    onOpenChange(false);
  }

  async function onInvitePlaceholder() {
    if (!name.trim()) return toast.error(t("members.form.nameRequired"));
    await invitePlaceholder(name.trim(), role);
    toast.success(t("members.toasts.invited"));
    onOpenChange(false);
  }

  async function onInviteLink() {
    const link = await inviteWithLink(role, emailMemo.trim() || undefined);
    if (!link) {
      toast.error(t("members.toasts.noToken"));
      return;
    }
    setShareLink(link);
    toast.success(t("members.toasts.invited"));
  }

  function copyLink() {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink).then(() => {
      toast.success(t("members.share.copied"));
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-w-[calc(100vw-1.5rem)]">
        <DialogHeader>
          <DialogTitle>{t("members.invite.title")}</DialogTitle>
          <DialogDescription>{t("members.invite.desc")}</DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="w-full grid grid-cols-3 gap-1 text-xs sm:text-sm">
            <TabsTrigger value="existing">{t("members.form.tabs.existing")}</TabsTrigger>
            <TabsTrigger value="placeholder">{t("members.form.tabs.placeholder")}</TabsTrigger>
            <TabsTrigger value="link">{t("members.form.tabs.link")}</TabsTrigger>
          </TabsList>

          {/* EXISTING */}
          <TabsContent value="existing" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("members.form.userId")}</label>
              <Input className="h-9 text-xs sm:text-sm" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="ID de l'utilisateur" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("members.form.role")}</label>
              <Select value={role} onValueChange={(v) => setRole(v as any)}>
                <SelectTrigger className="h-9 w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="OWNER">{t("members.roles.owner")}</SelectItem>
                  <SelectItem value="COLLABORATOR">{t("members.roles.collaborator")}</SelectItem>
                  <SelectItem value="VIEWER">{t("members.roles.viewer")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button className="w-full sm:w-auto" onClick={onInviteExisting}>{t("members.actions.invite")}</Button>
            </DialogFooter>
          </TabsContent>

          {/* PLACEHOLDER */}
          <TabsContent value="placeholder" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("members.form.name")}</label>
              <Input className="h-9 text-xs sm:text-sm" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("members.form.namePh") ?? ""} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("members.form.role")}</label>
              <Select value={role} onValueChange={(v) => setRole(v as any)}>
                <SelectTrigger className="h-9 w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="OWNER">{t("members.roles.owner")}</SelectItem>
                  <SelectItem value="COLLABORATOR">{t("members.roles.collaborator")}</SelectItem>
                  <SelectItem value="VIEWER">{t("members.roles.viewer")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button className="w-full sm:w-auto" onClick={onInvitePlaceholder}>{t("members.actions.invite")}</Button>
            </DialogFooter>
          </TabsContent>

          {/* LINK */}
          <TabsContent value="link" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("members.form.role")}</label>
              <Select value={role} onValueChange={(v) => setRole(v as any)}>
                <SelectTrigger className="h-9 w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="OWNER">{t("members.roles.owner")}</SelectItem>
                  <SelectItem value="COLLABORATOR">{t("members.roles.collaborator")}</SelectItem>
                  <SelectItem value="VIEWER">{t("members.roles.viewer")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("members.form.emailMemo")}</label>
              <Input className="h-9 text-xs sm:text-sm" value={emailMemo} onChange={(e) => setEmailMemo(e.target.value)} placeholder="exemple@walletwiz.fr" />
              <p className="text-xs text-muted-foreground">{t("members.form.emailMemoHint")}</p>
            </div>

            {shareLink ? (
              <div className="rounded-md border p-3 space-y-2">
                <div className="text-sm font-medium">{t("members.share.title")}</div>
                <div className="text-xs break-words">{shareLink}</div>
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <Button className="w-full sm:w-auto" variant="secondary" onClick={copyLink}>
                    <Copy className="h-4 w-4 mr-2" /> {t("members.share.copy")}
                  </Button>
                  <a href={shareLink} target="_blank" rel="noreferrer">
                    <Button className="w-full sm:w-auto" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" /> {t("members.share.open")}
                    </Button>
                  </a>
                </div>
              </div>
            ) : null}

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button className="w-full sm:w-auto" onClick={onInviteLink}>{t("members.actions.generateLink")}</Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
