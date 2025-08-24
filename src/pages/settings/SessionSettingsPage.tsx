import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useSessionService } from "@/lib/service/session.service";
import { useSessionStore } from "@/stores/sessionStore";
import type { Session } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SessionSettingsPage() {
  const { t } = useTranslation();
  const { getMySessions, createSession, setDefaultSession, deleteSession } =
    useSessionService();
  const { sessions, setSessions, currentSessionId, setCurrentSession } = useSessionStore();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  async function load() {
    setLoading(true);
    try {
      const list = await getMySessions();
      setSessions(list);
    } catch {
      toast.error(t("sessions.toasts.loadError"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (sessions.length === 0) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const s = await createSession(name.trim());
      toast.success(t("sessions.toasts.created"));
      setName("");
      await load();
      setCurrentSession(s.id);
    } finally {
      setLoading(false);
    }
  }

  async function onSetDefault(id: string) {
    setLoading(true);
    try {
      await setDefaultSession(id);
      toast.success(t("sessions.toasts.setDefault"));
      await load();
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: string) {
    setLoading(true);
    try {
      await deleteSession(id);
      toast.success(t("sessions.toasts.deleted"));
      await load();
      if (currentSessionId === id) setCurrentSession(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("sessions.settings.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("sessions.settings.subtitle")}</p>
      </div>

      <div className="flex gap-2 items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="session-name">{t("sessions.create.label")}</Label>
          <Input
            id="session-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("sessions.create.placeholder")}
            disabled={loading}
          />
        </div>
        <Button onClick={onCreate} disabled={loading}>
          {t("common.create")}
        </Button>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-medium">{t("sessions.list.title")}</h2>
        <div className="grid gap-2">
          {sessions.map((s: Session) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex flex-col">
                <span className="font-medium">
                  {s.name} {s.isDefault ? "• ★" : ""}
                </span>
                <span className="text-xs text-muted-foreground">{s.id}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onSetDefault(s.id)} disabled={loading}>
                  {t("sessions.actions.setDefault")}
                </Button>
                <Button variant="destructive" onClick={() => onDelete(s.id)} disabled={loading}>
                  {t("common.delete")}
                </Button>
              </div>
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="text-sm text-muted-foreground">
              {t("sessions.list.empty")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}