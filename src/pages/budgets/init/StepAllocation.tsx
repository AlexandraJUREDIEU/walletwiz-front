import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMonthKey, getMonthLabel } from "@/lib/dateUtils";
import type { Allocation } from "@/types/budgets";
import { useEffect, useState } from "react";

type StepAllocationProps = {
  incomes: number;
  expenses: number;
  allocations: Allocation[];
  onUpdate: (partial: { allocations: Allocation[] }) => void;
  onPrev: () => void;
  onNext: () => void;
};

const categories: Allocation["category"][] = ['vital', 'car', 'leisure', 'savings'];

export default function StepAllocation({
  incomes,
  expenses,
  allocations,
  onUpdate,
  onPrev,
  onNext,
}: StepAllocationProps) {
  const available = incomes - expenses
  const currentMonthKey = getMonthKey();

  const [percentages, setPercentages] = useState<Record<Allocation["category"], number>>(
    allocations.length === 4
      ? Object.fromEntries(allocations.map((a) => [a.category, Math.round((a.amount / available) * 100)])
        ) as Record<Allocation["category"], number>
      : { vital: 0, car: 0, leisure: 0, savings: 0 }
  )

  const totalPercent = Object.values(percentages).reduce((sum, val) => sum + val, 0)

  const computedAllocations: Allocation[] = categories.map((cat) => ({
    category: cat,
    amount: parseFloat(((percentages[cat] / 100) * available).toFixed(2))
  }))

  useEffect(() => {
    onUpdate({ allocations: computedAllocations })
  }, [percentages])

  const updatePercentage = (category: Allocation["category"], value: number) => {
    setPercentages((prev) => ({
      ...prev,
      [category]: value
    }))
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Étape 3 : Répartition</h2>
      <p className="mb-2">
        Indiquez vos allocations budgétaires pour le mois de {getMonthLabel(currentMonthKey)}.
      </p>
      <div className="bg-muted p-4 rounded">
        <p><strong>Disponible :</strong> {available.toFixed(2)} €</p>
        <p>
          <strong>Total réparti :</strong> {totalPercent}% (
          {computedAllocations.reduce((sum, a) => sum + a.amount, 0).toFixed(2)} €)
        </p>
        <p className={totalPercent === 100 ? 'text-green-600' : 'text-red-500'}>
          {totalPercent === 100
            ? 'Répartition équilibrée ✅'
            : `Attention : total actuel = ${totalPercent}%`}
        </p>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat}>
            <Label className="capitalize">{cat}</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                min={0}
                max={100}
                step={1}
                value={percentages[cat]}
                onChange={(e) => updatePercentage(cat, parseFloat(e.target.value) || 0)}
              />
              <span>% → {((percentages[cat] / 100) * available).toFixed(2)} €</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>Retour</Button>
        <Button
          onClick={onNext}
          disabled={totalPercent !== 100}
        >
          Valider la répartition
        </Button>
      </div>
    </div>
  );
}
