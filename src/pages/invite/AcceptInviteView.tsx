import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useMembers } from "@/hooks/useMembers";
import { useAuthStore } from "@/stores/authStore"; // si dispo

export default function AcceptInviteView() {
  const { token } = useParams<{ token: string }>();
  const { t } = useTranslation();
  const nav = useNavigate();
  const { readInvite, acceptInviteToken } = useMembers();
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (!token) return;
      try {
        const data = await readInvite(token);
        setInfo(data);
      } catch {
        toast.error(t("invite.accept.invalid"));
      } finally {
        setLoading(false);
      }
    })();
  }, [token, readInvite, t]);

  async function onAccept() {
    if (!token) return;
    try {
      await acceptInviteToken(token);
      toast.success(t("invite.accept.success"));
      // si user non connecté → vers /login, sinon dashboard
      const isAuthed = !!useAuthStore?.getState?.().token;
      nav(isAuthed ? "/dashboard/home" : "/login", { replace: true });
    } catch {
      toast.error(t("invite.accept.error"));
    }
  }

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">{t("invite.accept.loading")}</div>;
  }

  if (!info) {
    return <div className="p-6 text-sm text-destructive">{t("invite.accept.invalid")}</div>;
  }
    if (loading) {
    return <div className="p-4 sm:p-6 text-sm text-muted-foreground">{t("invite.accept.loading")}</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">{t("invite.accept.title")}</CardTitle>
          <CardDescription>{t("invite.accept.desc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm">
            <span className="text-muted-foreground">{t("invite.accept.session")}:</span>{" "}
            <span className="font-medium">{info.session?.name ?? info.sessionId}</span>
          </div>
          {info.invitedEmail ? (
            <div className="text-sm">
              <span className="text-muted-foreground">{t("invite.accept.email")}:</span>{" "}
              <span>{info.invitedEmail}</span>
            </div>
          ) : null}
          <Button className="mt-2 w-full sm:w-auto" onClick={onAccept}>{t("invite.accept.cta")}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
