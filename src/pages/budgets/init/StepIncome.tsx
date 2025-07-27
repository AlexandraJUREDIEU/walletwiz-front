import { useEffect, useState } from 'react';
import { useIncomeStore } from '@/stores/incomeStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Income } from '@/types/incomes';
import { v4 as uuidv4 } from 'uuid';

type StepIncomeProps = {
  onUpdate: (partial: Partial<{ incomes: number }>) => void;
  onNext: () => void;
};

export default function StepIncome({ onNext, onUpdate }: StepIncomeProps) {
  const defaultIncomes = useIncomeStore((s) => s.incomes);

  const [incomes, setIncomes] = useState<Income[]>(
    defaultIncomes.map((i) => ({ ...i })) // clone
  );

  const handleChange = (id: string, field: keyof Income, value: string | number) => {
    setIncomes((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const handleAddIncome = () => {
    setIncomes((prev) => [
      ...prev,
      {
        id: uuidv4(),
        label: '',
        amount: 0,
        day: 1,
        memberId: 'self',
        bankId: '',
      },
    ]);
  };

  const total = incomes.reduce((sum, i) => sum + (i.amount || 0), 0);

  useEffect(() => {
    onUpdate({ incomes: total });
  }, [total]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Étape 1 : Revenus</h2>
      <p className="mb-2">Voici les revenus que vous avez déclarés :</p>
      <div className="space-y-6">
        <div className="space-y-4">
          {incomes.map((i) => (
            <div key={i.id} className="flex flex-col gap-1">
              <Input
                placeholder="Intitulé (ex : Salaire, Freelance...)"
                value={i.label}
                onChange={(e) => handleChange(i.id, 'label', e.target.value)}
              />
              <Input
                type="number"
                step="0.01"
                value={i.amount}
                onChange={(e) => handleChange(i.id, 'amount', parseFloat(e.target.value) || 0)}
              />
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={handleAddIncome}>
          ➕ Ajouter un revenu ponctuel
        </Button>

        <div className="pt-4">
          <p>
            <strong>Total :</strong> {total.toFixed(2)} €
          </p>
        </div>

        <Button className="mt-4" onClick={onNext}>
          Suivant
        </Button>
      </div>
    </div>
  );
}
