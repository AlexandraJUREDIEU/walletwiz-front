import { useEffect, useState } from 'react';
import { useMemberService } from '@/lib/service/member.service';
import type { Member } from '@/types/members';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useSessionStore } from '@/stores/sessionStore';

export function MemberList() {
  // * Récupération des membres depuis le backend
  const { getMembersBySession } = useMemberService();
  // * Recuperation de l'ID de session depuis le store
  const currentSession = useSessionStore((s) => s.currentSession);

  // * State pour les membres
  const [members, setMembers] = useState<Member[]>([]);
  const session = currentSession;

  // * Handlers
  const MembersList = async (sessionId: string) => {
    const { data, error } = await getMembersBySession(sessionId);
    if (error) {
      toast.error('Erreur lors de la récupération des membres:');
      console.error('Error fetching members:', error);
    } else if (data) {
      toast.success('Membres récupérés avec succès:');
      console.log('Fetched Members:', data);
      setMembers(data);
    }
    return data;
  };

  useEffect(() => {
    console.log('Fetching members for session ID:', session?.id);
    if (session?.id) {
      MembersList(session.id);
    } else {
      toast.error('Session ID is required to fetch members.');
    }
  }, [session?.id]);

  return (
    <>
      <div className="space-y-2">
        {members.map((member: Member) => (
          <div
            key={member.id}
            className="flex flex-row justify-between items-center border p-3 rounded"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs md:text-sm font-semibold">
                  {member.firstName} {member.lastName} ({member.role})
                </p>
                {/*Etat des Invitation */}
                {member.status === 'PENDING' && (
                  <Badge
                    variant="outline"
                    className="text-[0.65em] md:text-xs text-yellow-600 border-yellow-400"
                  >
                    ⏳ En attente
                  </Badge>
                )}
                {member.status === 'ACCEPTED' && (
                  <Badge
                    variant="outline"
                    className="text-[0.65em] md:text-xs text-green-600 border-green-400"
                  >
                    ✅ Acceptée
                  </Badge>
                )}
                {member.status === 'DECLINED' && (
                  <Badge
                    variant="outline"
                    className="text-[0.65em] md:text-xs text-red-600 border-red-400"
                  >
                    ❌ Refusée
                  </Badge>
                )}
              </div>
              {member.email && (
                <p className="text-xs md:text-sm text-muted-foreground">{member.email}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              {/* Actions */}
              <Button
                className="text-xs md:text-sm px-2"
                variant="outline"
                onClick={() => console.log(`Modifier le membre ${member.id}`)}
              >
                Modifier
              </Button>
              <Button
                className="text-xs md:text-sm px-2"
                variant="secondary"
                onClick={() => console.log(`Supprimer le membre ${member.id}`)}
              >
                Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
