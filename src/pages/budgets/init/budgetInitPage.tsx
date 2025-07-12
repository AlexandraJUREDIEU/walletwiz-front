import { useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import StepIncome from './StepIncome'
import StepExpense from './StepExpense'
import StepAllocation from './StepAllocation'
import StepSummary from './StepSummary'
import type { Allocation } from '@/types/budgets'

type BudgetInitData = {
  month: string
  incomes: number
  expenses: number
  allocations: Allocation[]
}

export default function BudgetInitPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const month = searchParams.get('month')

  const [step, setStep] = useState(0)
  const [data, setData] = useState<BudgetInitData>({
    month: month ?? '',
    incomes: 0,
    expenses: 0,
    allocations: []
  })

  useEffect(() => {
    if (!month) {
      alert('Aucun mois précisé')
      navigate('/dashboard/budgets')
    }
  }, [month, navigate])

  const nextStep = () => setStep((s) => Math.min(s + 1, 3))
  const prevStep = () => setStep((s) => Math.max(s - 1, 0))

  const updateData = (partial: Partial<BudgetInitData>) => {
    setData((prev) => ({ ...prev, ...partial }))
  }

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Initialisation du budget de {month}</h1>

      {step === 0 && <StepIncome onNext={nextStep} onUpdate={updateData} />}
      {step === 1 && <StepExpense onNext={nextStep} onPrev={prevStep} onUpdate={updateData} />}
      {step === 2 && (
        <StepAllocation
          incomes={data.incomes}
          expenses={data.expenses}
          allocations={data.allocations}
          onNext={nextStep}
          onPrev={prevStep}
          onUpdate={updateData}
        />
      )}
      {step === 3 && (
        <StepSummary
          data={data}
          onPrev={prevStep}
        />
      )}
    </div>
  )
}