import { useBudgetStore } from '@/stores/budgetStore';
import { Button } from '@/components/ui/button';
import type { Allocation } from '@/types/budgets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import dayjs from '@/lib/dayjs';

type Props = {
  data: {
    month: string;
    incomes: number;
    expenses: number;
    allocations: Allocation[];
  };
  onPrev: () => void;
};

export default function StepSummary({ data, onPrev }: Props) {
  const navigate = useNavigate();
  const create = useBudgetStore((s) => s.initNewBudget);
  const available = data.incomes - data.expenses;

  const totalAllocated = data.allocations.reduce((sum, a) => sum + a.amount, 0);
  const remaining = available - totalAllocated;

  const handleValidate = () => {
    create(data.month, data.allocations);
    toast.success(`Budget de ${dayjs(data.month).format('MMMM YYYY')} créé avec succès !`);
    navigate('/dashboard/budgets', { replace: true });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Résumé du budget</h2>

      <div className="bg-muted p-4 rounded space-y-1">
        <p>
          <strong>Mois :</strong> {data.month}
        </p>
        <p>
          <strong>Revenus :</strong> {data.incomes.toFixed(2)} €
        </p>
        <p>
          <strong>Charges :</strong> {data.expenses.toFixed(2)} €
        </p>
        <p>
          <strong>Disponible :</strong> {available.toFixed(2)} €
        </p>
      </div>

      <div className="bg-muted p-4 rounded space-y-2">
        <h3 className="font-semibold">Répartition</h3>
        {data.allocations.map((a) => {
          const percent = ((a.amount / available) * 100).toFixed(0);
          return (
            <p key={a.category} className="capitalize">
              {a.category} : {percent}% → {a.amount.toFixed(2)} €
            </p>
          );
        })}
        <p className={Math.abs(remaining) <= 0.01 ? 'text-green-600' : 'text-red-500'}>
          {Math.abs(remaining) <= 0.01
            ? 'Répartition équilibrée ✅'
            : `Attention : reste non réparti de ${remaining.toFixed(2)} €`}
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Retour
        </Button>
        <Button onClick={handleValidate} disabled={Math.abs(remaining) > 0.01}>
          Créer le budget
        </Button>
      </div>
    </div>
  );
}
