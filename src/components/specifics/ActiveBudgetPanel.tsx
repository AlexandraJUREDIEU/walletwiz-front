import { useBudgetStore } from '@/stores/budgetStore';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getMonthKey, getNextMonthKey, getMonthLabel } from '@/lib/dateUtils';
import { Button } from '@/components/ui/button';

export function ActiveBudgetPanel() {
  const navigate = useNavigate();
  const budgets = useBudgetStore((s) => s.budgets);
  const currentMonthKey = getMonthKey();
  const nextMonthKey = getNextMonthKey();

  const currentBudget = budgets.find((b) => b.month === currentMonthKey);
  const nextBudget = budgets.find((b) => b.month === nextMonthKey);

  const nextMonthLabel = getMonthLabel(nextMonthKey);

  if (!currentBudget) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Aucun budget actif pour le mois en cours</CardTitle>
            <CardDescription>Vous pouvez en créer un dès maintenant.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(`/dashboard/budgets/init?month=${currentMonthKey}`)}>
              ➕ Créer le budget de {getMonthLabel(currentMonthKey)}
            </Button>
          </CardContent>
        </Card>

        {nextBudget && (
          <Card>
            <CardHeader>
              <CardTitle>Budget de {nextMonthLabel} déjà renseigné</CardTitle>
              <CardDescription>
                Il sera actif à partir du 1er. Vous pouvez le modifier si besoin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate(`/dashboard/budgets/init?month=${nextMonthKey}`)}>
                ✏️ Modifier le budget de {nextMonthLabel}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // 🧾 Si budget courant trouvé, on affiche normalement
  const byCategory = currentBudget?.allocations.reduce<
    Record<string, { total: number; spent: number }>
  >((acc, a) => {
    acc[a.category] = { total: a.amount, spent: 0 };
    return acc;
  }, {});

  for (const tx of currentBudget?.transactions || []) {
    if (byCategory?.[tx.category]) {
      byCategory[tx.category].spent += tx.amount;
    }
  }

  return (
    <div className="p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-lg font-bold">Budget en cours – {getMonthLabel(currentBudget?.month)}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(byCategory || {}).map(([cat, val]) => {
          const remaining = val.total - val.spent;
          return (
            <div key={cat} className="border rounded p-3 space-y-1">
              <h3 className="capitalize font-medium">{cat}</h3>
              <p>Total : {val.total.toFixed(2)} €</p>
              <p>Dépensé : {val.spent.toFixed(2)} €</p>
              <p className={remaining < 0 ? 'text-red-600' : ''}>
                Reste : {remaining.toFixed(2)} €
              </p>
            </div>
          );
        })}
      </div>

      <div>
        <h3 className="font-semibold mt-4">Transactions</h3>
        {currentBudget?.transactions.length === 0 ? (
          <p className="text-muted-foreground">Aucune transaction enregistrée.</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {currentBudget?.transactions.map((tx) => (
              <li key={tx.id} className="text-sm">
                📅 {new Date(tx.date).toLocaleDateString()} – <strong>{tx.label}</strong> →{' '}
                {tx.amount.toFixed(2)} € ({tx.category})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
