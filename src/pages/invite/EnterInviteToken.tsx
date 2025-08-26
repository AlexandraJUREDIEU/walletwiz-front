import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EnterInviteToken() {
  const { t } = useTranslation();
  const [token, setToken] = useState("");
  const nav = useNavigate();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tok = token.trim();
    if (!tok) return;
    nav(`/invite/${tok}`);
  }

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 space-y-4">
      <h1 className="text-xl sm:text-2xl font-semibold">{t("invite.enter.title")}</h1>
      <p className="text-sm text-muted-foreground">{t("invite.enter.desc")}</p>
      <form onSubmit={onSubmit} className="space-y-2">
        <Input className="h-9" value={token} onChange={(e) => setToken(e.target.value)}
               placeholder={t("invite.enter.placeholder") ?? ""} />
        <Button type="submit" className="w-full sm:w-auto">{t("invite.enter.submit")}</Button>
      </form>
    </div>
  );
}