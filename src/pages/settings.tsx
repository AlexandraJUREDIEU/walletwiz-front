import { CreateSessionForm } from '@/components/forms/SessionForm';
import { useSessionService } from '@/lib/service/session.service';
import type { Session } from '@/types/session';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { useSessionStore } from '@/stores/sessionStore';

export default function SettingsPage() {
  const { getSessions } = useSessionService();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [personalSessions, setPersonalSessions] = useState<Session[]>([]);
  const [sharedSessions, setSharedSessions] = useState<Session[]>([]);
  const currentSession = useSessionStore((state) => state.currentSession);
  const setCurrentSession = useSessionStore((state) => state.setCurrentSession);

  const loadingSessions = async () => {
    const { data, error } = await getSessions();
    if (error) {
      console.error('Error loading sessions:', error);
    } else if (data) {
      setSessions(data);
      // On suppose que chaque session a ownerId et que l'utilisateur courant a un id
      const userId = currentSession?.ownerId || '';
      setPersonalSessions(data.filter((session: Session) => session.ownerId === userId));
      setSharedSessions(data.filter((session: Session) => session.ownerId !== userId));
    }
  };

  useEffect(() => {
    loadingSessions();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold">Préférences de répartition</h1>
      <p className="text-sm text-muted-foreground mt-2">
        Veuillez choisir votre session par défaut :
      </p>
      {sessions.length > 0 && (
        <div className="mt-4 w-full max-w-2xl mx-auto">
          <h2 className="text-lg md:text-xl font-semibold mb-2">Ma Session par default</h2>
          <div className="rounded-lg border bg-card p-2 md:p-4 shadow-sm">
            <ul className="flex flex-col gap-2">
              {sessions.map((session: Session) => (
                <li
                  key={session.id}
                  className="flex flex-col md:flex-row md:items-center justify-between hover:bg-muted rounded-md px-2 py-2 transition-colors"
                >
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <Checkbox
                      checked={currentSession?.id === session.id}
                      onCheckedChange={() => setCurrentSession(session)}
                      id={`session-checkbox-${session.id}`}
                    />
                    <label
                      htmlFor={`session-checkbox-${session.id}`}
                      className="text-sm font-medium cursor-pointer truncate"
                    >
                      {session.name}
                    </label>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 md:mt-0 md:ml-4 text-right md:text-left">
                    Propriétaire : {session.owner.email}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Section budgets personnels */}
      <div className="mt-8 w-full max-w-2xl mx-auto">
        <h2 className="text-lg md:text-xl font-semibold mb-2">Mes budgets personnels</h2>
        <div className="rounded-lg border bg-card p-2 md:p-4 shadow-sm">
          {personalSessions.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {personalSessions.map((session: Session) => (
                <li key={session.id} className="flex justify-between items-center px-2 py-2 rounded-md hover:bg-muted transition-colors">
                  <span className="font-medium">{session.name}</span>
                  <span className="text-xs text-muted-foreground">Propriétaire : {session.owner.email}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">Aucun budget personnel trouvé.</p>
          )}
        </div>
      </div>

      {/* Section budgets partagés */}
      <div className="mt-8 w-full max-w-2xl mx-auto">
        <h2 className="text-lg md:text-xl font-semibold mb-2">Budgets partagés avec moi</h2>
        <div className="rounded-lg border bg-card p-2 md:p-4 shadow-sm">
          {sharedSessions.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {sharedSessions.map((session: Session) => (
                <li key={session.id} className="flex justify-between items-center px-2 py-2 rounded-md hover:bg-muted transition-colors">
                  <span className="font-medium">{session.name}</span>
                  <span className="text-xs text-muted-foreground">Propriétaire : {session.owner.email}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">Aucun budget partagé trouvé.</p>
          )}
        </div>
      </div>

      <Separator className="my-4" />
      <CreateSessionForm onCreated={() => loadingSessions()} />
    </>
  );
}
