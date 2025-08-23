import { useSessionService } from "@/lib/service/session.service";
import { useSessionStore } from "@/stores/sessionStore";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function DashboardHome() {
  const { t } = useTranslation();

  const { getMySessions } = useSessionService();
const { setSessions } = useSessionStore.getState();
useEffect(() => {
  getMySessions().then((list) => {
    setSessions(list);
    console.log("Sessions:", list);
  });
}, []);

const { getSessionMembers } = useSessionService();
const { setMembers } = useSessionStore.getState();
// Suppose une session existe :
const s = useSessionStore.getState().sessions[0];
if (s) {
  getSessionMembers(s.id).then((ms) => setMembers(s.id, ms));
}
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">{t("nav.dashboard")}</h2>
      <p className="text-sm text-muted-foreground">{t("app.welcome")}</p>
    </div>
  );
}