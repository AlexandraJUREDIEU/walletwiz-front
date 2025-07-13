import { useEffect, useState } from "react";
import { useExpenseStore } from "@/stores/expenseStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Expense } from "@/types/expenses";
import { v4 as uuidv4 } from "uuid";

type StepExpenseProps = {
  onUpdate: (partial: Partial<{ expenses: Expense[] }>) => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function StepExpense({
  onUpdate,
  onPrev,
  onNext,
}: StepExpenseProps) {
  const defaultExpenses = useExpenseStore((s) => s.expenses);

  const [expenses, setExpenses] = useState<Expense[]>(
    defaultExpenses.map((e) => ({ ...e }))
  );

  const handleChange = (
    id: string,
    field: keyof Expense,
    value: string | number
  ) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const handleAddExpense = () => {
    setExpenses((prev) => [
      ...prev,
      {
        id: uuidv4(),
        label: "",
        amount: 0,
        dueDay: 1,
        frequency: "monthly",
        category: "other",
        memberIds: [],
        bankId: "",
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  useEffect(() => {
    onUpdate({ expenses });
  }, [expenses]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Étape 2 : Dépenses</h2>
      <p className="mb-2">
        Indiquez vos dépenses mensuelles pour initialiser votre budget.
      </p>
      <div className="space-y-4">
        {expenses.map((e) => (
          <div key={e.id} className="flex flex-col gap-1">
            <Input
              placeholder="Intitulé (ex : Loyer, Netflix...)"
              value={e.label}
              onChange={(ev) => handleChange(e.id, "label", ev.target.value)}
            />
            <Input
              type="number"
              step="0.01"
              value={e.amount}
              onChange={(ev) =>
                handleChange(e.id, "amount", parseFloat(ev.target.value) || 0)
              }
            />
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={handleAddExpense}>
        ➕ Ajouter une charge ponctuelle
      </Button>

      <div className="pt-4">
        <p>
          <strong>Total :</strong> {total.toFixed(2)} €
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Retour
        </Button>
        <Button onClick={onNext}>Suivant</Button>
      </div>
    </div>
  );
}
