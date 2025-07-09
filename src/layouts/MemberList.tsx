import { useMemberStore } from '@/stores/memberStore';
import { Button } from '@/components/ui/button';

export function MemberList() {
  const { members, deleteMember } = useMemberStore();

  if (!members.length) return <p className="text-sm text-muted-foreground">No members added yet.</p>;

  return (
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
            {member.email && <p className="text-sm text-muted-foreground">{member.email}</p>}
            {!member.isReal && <span className="text-xs italic">Fictif</span>}
          </div>
          <Button variant="destructive" onClick={() => deleteMember(member.id)}>
            Supprimer
          </Button>
        </div>
      ))}
    </div>
  );
}