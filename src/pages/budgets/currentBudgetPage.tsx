import { useParams } from 'react-router-dom';
import { useBudgetStore } from '@/stores/budgetStore';
import { TransactionList } from '@/layouts/TransactionList';
import dayjs from '@/lib/dayjs';

export default function CurrentBudgetPage() {
  const { budgetMonth } = useParams<{ budgetMonth: string }>();
  const budget = useBudgetStore((s) => s.getBudgetByMonth(budgetMonth ?? ''));
  const available = useBudgetStore((s) => s.getAvailableByCategory(budgetMonth ?? ''));

  if (!budget) {
    return <div className="p-6 text-red-500">Budget introuvable.</div>;
  }

  const monthFormatted = dayjs(`${budget.month}-01`).format('MMMM YYYY');

  return (
    <div className="p-6 space-y-8">
      {/* 🟦 Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold capitalize">{monthFormatted}</h1>
        <div className="flex gap-2">
          <button className="border px-3 py-1 rounded text-sm">Mensuel</button>
          <button className="border px-3 py-1 rounded text-sm">Semaine</button>
          <button className="border px-3 py-1 rounded text-sm">Jour</button>
        </div>
      </div>

      {/* 🟨 Section 1 - Répartition */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Répartition par catégorie</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {budget.allocations.map((alloc) => {
            const reste = available[alloc.category] ?? 0;
            return (
              <div key={alloc.category} className="border p-4 rounded">
                <p className="font-medium capitalize">{alloc.category}</p>
                <p className="text-sm text-muted-foreground">
                  Disponible : {reste.toFixed(2)} € sur {alloc.amount.toFixed(2)} €
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🟪 Section 2 - Transactions */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Transactions</h2>
        <TransactionList budgetMonth={budget.month} />
      </div>
    </div>
  );
}
