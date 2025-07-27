import { useBudgetStore } from '@/stores/budgetStore';
import { Button } from '@/components/ui/button';
import type { Transaction } from '@/types/transactions';
import dayjs from 'dayjs';

type Props = {
  budgetMonth: string;
  onEdit?: (transaction: Transaction) => void;
};

export const TransactionList = ({ budgetMonth, onEdit }: Props) => {
  const budget = useBudgetStore((s) => s.getBudgetByMonth(budgetMonth));
  const removeTransaction = useBudgetStore((s) => s.removeTransaction);

  if (!budget || budget.transactions.length === 0) {
    return <p className="text-muted-foreground">Aucune transaction pour ce mois.</p>;
  }

  return (
    <div className="space-y-3 mt-4">
      {budget.transactions.map((t) => (
        <div key={t.id} className="border rounded-md p-4 flex justify-between items-center">
          <div>
            <p className="font-medium">{t.label}</p>
            <p className="text-sm text-muted-foreground">
              {t.type === 'expense' ? '-' : '+'}
              {t.amount.toFixed(2)} € • {t.category} • {dayjs(t.date).format('DD/MM/YYYY')}
            </p>
          </div>

          <div className="flex gap-2">
            {onEdit && (
              <Button size="sm" variant="outline" onClick={() => onEdit(t)}>
                Modifier
              </Button>
            )}
            <Button
              size="sm"
              variant="destructive"
              onClick={() => removeTransaction(budgetMonth, t.id)}
            >
              Supprimer
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
