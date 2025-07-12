import { useIncomeStore } from '@/stores/incomeStore';
import { useMemberStore } from '@/stores/memberStore';
import { useBankStore } from '@/stores/bankStore';
import { Button } from '@/components/ui/button';
import type { Income } from '@/types/incomes';
import { DialogEditIncome } from '@/components/dialog/DialogEditIncome';

export const IncomesList = () => {
  const incomes = useIncomeStore((s) => s.incomes);
  const deleteIncome = useIncomeStore((s) => s.deleteIncome);
  const members = useMemberStore((s) => s.members);
  const banks = useBankStore((s) => s.banks);

  const getMemberName = (id: string) =>
    id === 'self' ? 'Moi' : members.find((m) => m.id === id)?.firstName || 'Inconnu';

  const getBankName = (id: string) =>
    banks.find((b) => b.id === id)?.name || 'Compte inconnu';

  return (
    <div className="space-y-2">
      {incomes.length === 0 && (
        <p className="text-muted-foreground">Aucun revenu renseigné.</p>
      )}

      {incomes.map((income : Income) => (
        <div
          key={income.id}
          className="flex justify-between items-center border p-3 rounded-md"
        >
          <div>
            <p className="font-semibold">{income.label}</p>
            <p className="text-sm text-muted-foreground">
              {income.amount.toFixed(2)} € - chaque mois le {income.day}
              <br />
              Affecté à : <strong>{getMemberName(income.memberId)}</strong>
              {' • '}
              Compte : <strong>{getBankName(income.bankId)}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DialogEditIncome income={income} />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteIncome(income.id)}
          >
            Supprimer
          </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
