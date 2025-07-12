import { useBudgetStore } from '@/stores/budgetStore'
import { useNavigate } from 'react-router-dom'

export function ActiveBudgetPanel() {
  const budgets = useBudgetStore((s) => s.budgets)

  const today = new Date()
  const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  const nextMonthKey = `${today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear()}-${String((today.getMonth() + 2) % 13 || 1).padStart(2, '0')}`

  const currentBudget = budgets.find((b) => b.month === currentMonthKey)
  const nextBudget = budgets.find((b) => b.month === nextMonthKey)

const navigate = useNavigate()

if (!currentBudget && nextBudget) {
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-300 rounded text-yellow-800 space-y-2">
      <p>
        Vous avez déjà paramétré le budget de <strong>{nextBudget.month}</strong>.<br />
        Il sera actif à partir du 1er.
      </p>
      <button
        className="text-sm text-yellow-900 underline"
        onClick={() => navigate(`/dashboard/budgets/init?month=${nextBudget.month}`)}
      >
        ✏️ Modifier le budget de {nextBudget.month}
      </button>
    </div>
  )
}

  if (!currentBudget && nextBudget) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-300 rounded text-yellow-800">
        <p>
          Vous avez déjà paramétré le budget de <strong>{nextBudget.month}</strong>.<br />
          Il sera actif à partir du 1er.
        </p>
      </div>
    )
  }

  // 🧾 Si budget courant trouvé, on affiche normalement
  const byCategory = currentBudget?.allocations.reduce<Record<string, { total: number, spent: number }>>(
    (acc, a) => {
      acc[a.category] = { total: a.amount, spent: 0 }
      return acc
    }, {}
  )

  for (const tx of currentBudget?.transactions || []) {
    if (byCategory?.[tx.category]) {
      byCategory[tx.category].spent += tx.amount
    }
  }

  return (
    <div className="p-4 bg-white rounded shadow space-y-4">
      <h2 className="text-lg font-bold">
        Budget en cours – {currentBudget?.month}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(byCategory || {}).map(([cat, val]) => {
          const remaining = val.total - val.spent
          return (
            <div key={cat} className="border rounded p-3 space-y-1">
              <h3 className="capitalize font-medium">{cat}</h3>
              <p>Total : {val.total.toFixed(2)} €</p>
              <p>Dépensé : {val.spent.toFixed(2)} €</p>
              <p className={remaining < 0 ? 'text-red-600' : ''}>
                Reste : {remaining.toFixed(2)} €
              </p>
            </div>
          )
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
                📅 {new Date(tx.date).toLocaleDateString()} – <strong>{tx.label}</strong> → {tx.amount.toFixed(2)} € ({tx.category})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}