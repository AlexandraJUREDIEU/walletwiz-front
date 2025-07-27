import { useIncomeStore } from '@/stores/incomeStore';
import { useMemberStore } from '@/stores/memberStore';

export const IncomesSummary = () => {
  const incomes = useIncomeStore((s) => s.incomes);
  const members = useMemberStore((s) => s.members);

  const getTotalByMember = (memberId: string) =>
    incomes.filter((i) => i.memberId === memberId).reduce((acc, i) => acc + i.amount, 0);

  const total = incomes.reduce((acc, i) => acc + i.amount, 0);

  return (
    <div className="border rounded-lg p-4 space-y-2 shadow-sm">
      <h2 className="text-lg font-semibold">Total des revenus</h2>
      <p className="text-2xl font-bold text-green-600">{total.toFixed(2)} €</p>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>
          Moi : <strong>{getTotalByMember('self').toFixed(2)} €</strong>
        </p>
        {members.map((m) => (
          <p key={m.id}>
            {m.firstName} : <strong>{getTotalByMember(m.id).toFixed(2)} €</strong>
          </p>
        ))}
      </div>
    </div>
  );
};
