import { useState } from 'react';
import type { Member } from '@/types/members';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useMemberStore } from '@/stores/memberStore';
import { Button } from '@/components/ui/button';
import { MemberForm } from '@/components/forms/MemberForm';

export function MemberList() {
  const { members, deleteMember } = useMemberStore();
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  return (
    <>
      <div className="space-y-2">
        {members.map((member) => (
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
            </div>
            <div className="flex gap-2">
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