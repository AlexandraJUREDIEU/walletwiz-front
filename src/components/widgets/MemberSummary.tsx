import { useMemberStore } from '@/stores/memberStore';

export function MemberSummary() {
  const { members } = useMemberStore();
  const realMembers = members.filter((m) => m.isReal).length;
  const total = members.length;

  return (
    <div className="p-4 bg-muted rounded-lg">
      <p className="text-sm font-medium">Membres ajoutés</p>
      <p className="text-lg font-bold">
        {total} membre{total > 1 ? 's' : ''} ({realMembers} réel{realMembers > 1 ? 's' : ''})
      </p>
    </div>
  );
}
