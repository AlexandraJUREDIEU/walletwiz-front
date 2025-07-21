import { CreateSessionForm } from "@/components/forms/SessionForm";
import { useSessionService } from "@/lib/service/session.service";
import type { Session } from "@/types/session";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { getSessions } = useSessionService();
  const [sessions, setSessions] = useState<Session[]>([]);
  

  const loadingSessions = async () => {
    const { data, error } = await getSessions();
    if (error) {
      console.error("Error loading sessions:", error);
    } else if (data) {
      console.log("Sessions loaded successfully:", data);
      setSessions(data);

    }
  }

  useEffect(() => {
    loadingSessions();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold">Préférences de répartition</h1>
       {sessions.length > 0 && (
        <div className="mt-4">
          <h2 className="lg:text-xl font-semibold">Mes Sessions</h2>
            {sessions.map((session : Session) => (
              <p key={session.id} className="text-xs mt-2">
                {session.name} - {session.ownerId}
              </p>
            ))}
        </div>
       )}
       <Separator className="my-4" />
       <CreateSessionForm onCreated={() => loadingSessions()} />
    </>
  )
}