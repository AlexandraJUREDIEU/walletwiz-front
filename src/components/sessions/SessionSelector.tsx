import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useSessionsBootstrap } from "@/hooks/useSessionsBootstrap";
import { useSessionService } from "@/lib/service/session.service";
import { useSessionStore } from "@/stores/sessionStore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";

export function SessionSelector() {
  const { t } = useTranslation();
  useSessionsBootstrap();

  const { getMySessions, createSession, setDefaultSession, getSessionMembers } =
    useSessionService();

  const {
    sessions,
    currentSessionId,
    setSessions,
    setCurrentSession,
    setMembers,
    getCurrentSession,
  } = useSessionStore();

  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const current = getCurrentSession();
  const sorted = useMemo(
    () =>
      [...sessions].sort((a, b) => {
        // rendre la default en tête
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return a.name.localeCompare(b.name);
      }),
    [sessions]
  );

  // Rafraîchir la liste après création/changement défaut
  async function refreshSessions(keepCurrent?: boolean) {
    const list = await getMySessions();
    setSessions(list);
    if (!keepCurrent) {
      const def = list.find((s) => s.isDefault) ?? list[0];
      setCurrentSession(def?.id ?? null);
      if (def?.id) {
        const ms = await getSessionMembers(def.id);
        setMembers(def.id, ms);
      }
    }
  }

  async function onSelect(id: string) {
    setCurrentSession(id);
    try {
      const ms = await getSessionMembers(id);
      setMembers(id, ms);
    } catch {
      toast.error(t("sessions.toasts.membersLoadError"));
    }
  }

  async function onCreate() {
    if (!newName.trim()) return;
    try {
      const s = await createSession(newName.trim());
      toast.success(t("sessions.toasts.created"));
      setCreating(false);
      setNewName("");
      // Recharger et sélectionner la nouvelle par défaut si le back la marque default, sinon rester sur current
      await refreshSessions(true);
      // Sélectionner explicitement la nouvelle si on veut imposer la prise de focus
      setCurrentSession(s.id);
      const ms = await getSessionMembers(s.id);
      setMembers(s.id, ms);
    } catch {
      // useApi toast déjà
    }
  }

  async function onSetDefault() {
    if (!current?.id) return;
    try {
      await setDefaultSession(current.id);
      toast.success(t("sessions.toasts.setDefault"));
      await refreshSessions(true);
    } catch {
      // useApi toast déjà
    }
  }

  return (
    <div className="space-y-3 p-3 bg-background">
      <div className="px-3 text-[11px] uppercase tracking-wide text-muted-foreground/80">
        {t("sessions.selector.title")}
      </div>

      {/* Selecteur */}
      <Select
        value={currentSessionId ?? undefined}
        onValueChange={onSelect}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={t("sessions.selector.placeholder")}
          />
        </SelectTrigger>
        <SelectContent>
          {sorted.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
              {s.isDefault ? " • ★" : ""}
            </SelectItem>
          ))}
          {sorted.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              {t("sessions.selector.empty")}
            </div>
          )}
        </SelectContent>
      </Select>

      {/* Boutons */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => setCreating((v) => !v)}
        >
          {creating ? t("common.cancel") : t("sessions.actions.create")}
        </Button>
        <Button
          variant="outline"
          
          onClick={onSetDefault}
          disabled={!current}
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>

      {/* Zone création inline */}
      {creating && (
        <div className="space-y-2">
          <Label htmlFor="new-session">{t("sessions.create.label")}</Label>
          <div className="flex gap-2">
            <Input
              id="new-session"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={t("sessions.create.placeholder")}
            />
            <Button onClick={onCreate}>{t("common.create")}</Button>
          </div>
        </div>
      )}
    </div>
  );
}