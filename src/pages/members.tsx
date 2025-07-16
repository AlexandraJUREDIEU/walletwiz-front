import { MemberForm } from '@/components/forms/MemberForm';
import { MemberList } from '@/layouts/MemberList';

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Membres du budget</h1>
      <MemberForm />
      <p className="text-sm text-muted-foreground">
        Gérer les membres qui ont accès à ce budget. Vous pouvez ajouter des membres fictifs pour simuler des budgets.
      </p>
      <MemberList />
    </div>
  );
}