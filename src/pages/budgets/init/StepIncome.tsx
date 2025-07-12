import { useEffect, useState } from "react"
import { useIncomeStore } from "@/stores/incomeStore"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Income } from "@/types/incomes"

type StepIncomeProps = {
    onUpdate: (partial: Partial<{ incomes: number }>) => void
    onNext: () => void
}

export default function StepIncome({ onNext, onUpdate }: StepIncomeProps){
const defaultIncomes = useIncomeStore((s) => s.incomes)

  const [incomes, setIncomes] = useState<Income[]>(
    defaultIncomes.map((i) => ({ ...i })) // clone
  )

  const handleChange = (id: string, value: number) => {
    setIncomes((prev) =>
      prev.map((i) => (i.id === id ? { ...i, amount: value } : i))
    )
  }


  const total = incomes.reduce((sum, i) => sum + i.amount, 0)

  useEffect(() => {
    onUpdate({ incomes: total })
  }, [total])


  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Étape 1 : Revenus</h2>
        <p className="mb-2">Voici les revenus que vous avez déclarés :</p>
        <div className="space-y-6">
      <div className="space-y-4">
        {incomes.map((i) => (
          <div key={i.id}>
            <Label>{i.label}</Label>
            <Input
              type="number"
              step="0.01"
              value={i.amount}
              onChange={(e) => handleChange(i.id, parseFloat(e.target.value) || 0)}
            />
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={() => console.log("Ajouter un revenu ponctuel")}>
        ➕ Ajouter un revenu ponctuel
      </Button>

      <div className="pt-4">
        <p><strong>Total :</strong> {total.toFixed(2)} €</p>
      </div>

      <Button className="mt-4" onClick={onNext}>
        Suivant
      </Button>
    </div>
    </div>
  )
}