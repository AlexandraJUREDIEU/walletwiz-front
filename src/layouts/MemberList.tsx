import { useState } from 'react';
import { useMemberStore } from '@/stores/memberStore';
import type { Member } from '@/types/members';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { MemberForm } from '@/components/forms/MemberForm';
import { Badge } from '@/components/ui/badge';

export function MemberList() {
  const { members, deleteMember, inviteMember } = useMemberStore();
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  if (!members.length) {
    return <p className="text-sm text-muted-foreground">Aucun membre ajouté pour le moment.</p>;
  }

  return (
    <>
      <div className="space-y-2">
        {members.map((member: Member) => (
          <div
            key={member.id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <div>
              <p className="font-semibold">
                {member.firstName} {member.lastName} ({member.role})
              </p>
              {member.email && (
                <p className="text-sm text-muted-foreground">{member.email}</p>
              )}
              {!member.isReal && (
                <span className="text-xs italic text-muted-foreground">Fictif</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Invitation */}
              {member.isReal && !member.invited && (
                <Button
                  variant="secondary"
                  onClick={() => inviteMember(member.id)}
                  disabled={!member.email}
                >
                  Inviter
                </Button>
              )}

              {member.invitationStatus === 'pending' && (
                <Badge variant="outline" className="text-yellow-600 border-yellow-400">
                  ⏳ En attente
                </Badge>
              )}
              {member.invitationStatus === 'accepted' && (
                <Badge variant="outline" className="text-green-600 border-green-400">
                  ✅ Acceptée
                </Badge>
              )}
              {member.invitationStatus === 'declined' && (
                <Badge variant="outline" className="text-red-600 border-red-400">
                  ❌ Refusée
                </Badge>
              )}

              {/* Actions */}
              <Button
                variant="outline"
                onClick={() => setEditingMember(member)}
              >
                Modifier
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteMember(member.id)}
              >
                Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog d'édition */}
      <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
        <DialogContent>
          {editingMember && (
            <MemberForm
              defaultValues={editingMember}
              onSubmitCallback={() => setEditingMember(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}