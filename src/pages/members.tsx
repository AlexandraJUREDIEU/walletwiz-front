import { InviteMemberForm } from '@/components/forms/InviteMemberForm';
import { MemberList } from '@/layouts/MemberList';

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Membres du budget</h1>
      <p className="text-sm text-muted-foreground">
        Gérer les membres qui ont accès à ce budget. Vous pouvez ajouter des membres fictifs pour
        simuler des budgets.
      </p>
      <MemberList />
      <InviteMemberForm />
    </div>
  );
}
