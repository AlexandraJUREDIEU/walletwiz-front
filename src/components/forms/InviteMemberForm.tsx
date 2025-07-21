import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { Session } from "@/types/session";
import { useSessionService } from "@/lib/service/session.service";
import { toast } from "sonner";

export function InviteMemberForm() {
  const { getSessions, inviteToSession } = useSessionService();
  const [sessions, setSessions] = useState<Session[]>([]);

  // * State to manage form data
  const [formData, setFormData] = useState<{
    sessionId: string;
    pseudo: string;
    email: string;
    role: "OWNER" | "ADULT" | "CHILD";
    isReal: boolean;
  }>({
    sessionId: sessions[0]?.id || "",
    pseudo: "",
    email: "",
    role: "OWNER",
    isReal: true,
  });

  // * Handlers

  const loadingSessions = async () => {
    const { data, error } = await getSessions();
    if (error) {
      console.error("Error loading sessions:", error);
    } else if (data) {
      console.log("Sessions loaded successfully:", data);
      setSessions(data);
    }
  };

  const handleInvite = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const sessionId = formData.sessionId;
    const payload = {
      email: formData.email,
      role: formData.role,
      isReal: formData.isReal,
    };
    const { data, error } = await inviteToSession(sessionId, payload);
    if (error) {
        toast.error("Erreur lors de l'invitation du membre.");
    } else if (data) {
        toast.success("Membre invité avec succès.");
        setFormData({
            sessionId: sessions[0]?.id || "",
            pseudo: "",
            email: "",
            role: "OWNER",
            isReal: true,
        });
    };
  };

  useEffect(() => {
    loadingSessions();
  }, []);
  return (
    <form onSubmit={handleInvite} className="space-y-4 max-w-md ">
        <Select
          value={formData.sessionId}
          onValueChange={(value) => setFormData((p) => ({ ...p, sessionId: value }))}  
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={sessions.length > 0 ? sessions[0].name : "Select session"} />
          </SelectTrigger>
          <SelectContent>
            {sessions.map((session) => (
              <SelectItem key={session.id} value={session.id}>
                {session.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>   
      <Input
        id="pseudo"
        value={formData.pseudo}
        placeholder="Pseudo"
        onChange={(e) => setFormData((p) => ({ ...p, pseudo: e.target.value }))}
      />
      <Input
        id="email"
        type="email"
        value={formData.email}
        placeholder="Email"
        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex gap-2 items-center ">
          <Label className="p-0 flex-1">Role</Label>
          <Select
            value={formData.role}
            onValueChange={(value) =>
              setFormData((p) => ({
                ...p,
                role: value as "OWNER" | "ADULT" | "CHILD",
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OWNER">Collaborateur</SelectItem>
              <SelectItem value="ADULT">Lecteur</SelectItem>
              <SelectItem value="CHILD">Enfant</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Label className="p-0 flex-1" htmlFor="isReal">
            Utilisateur réel
          </Label>
          <Switch
            id="isReal"
            checked={formData.isReal}
            onCheckedChange={(checked) =>
              setFormData((p) => ({ ...p, isReal: checked }))
            }
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Inviter
      </Button>
    </form>
  );
}

