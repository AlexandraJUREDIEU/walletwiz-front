import { useBudgetStore } from '@/stores/budgetStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import dayjs from '@/lib/dayjs';

export function PreviousBudgets() {
  const navigate = useNavigate();
  const budgets = useBudgetStore((s) => s.budgets);

  const currentMonthKey = dayjs().format('YYYY-MM');
  const previousBudgets = budgets
    .filter((b) => b.month < currentMonthKey)
    .sort((a, b) => (a.month < b.month ? 1 : -1)); // décroissant

  if (previousBudgets.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">Aucun budget précédent enregistré.</p>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-lg font-bold">Budgets précédents</h2>
      {previousBudgets.map((b) => {
        const incomeTotal = b.incomes?.reduce((sum, i) => sum + i.amount, 0) ?? 0;
        const expenseTotal = b.expenses?.reduce((sum, e) => sum + e.amount, 0) ?? 0;
        const allocationTotal = b.allocations?.reduce((sum, a) => sum + a.amount, 0) ?? 0;
        const label = dayjs(`${b.month}-01`).format('MMMM YYYY');

        return (
          <Card key={b.id}>
            <CardHeader>
              <CardTitle>{label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>💰 Revenus : {incomeTotal.toFixed(2)} €</p>
              <p>🏠 Dépenses : {expenseTotal.toFixed(2)} €</p>
              <p>📊 Répartition : {allocationTotal.toFixed(2)} €</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/dashboard/budgets/init?month=${b.month}`)}
              >
                ✏️ Modifier
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
