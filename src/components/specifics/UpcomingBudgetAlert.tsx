import { useNavigate } from "react-router-dom"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

// Determine if we are in a "special" time window
const isInPreparationWindow = (): boolean => {
  const today = new Date()
  const day = today.getDate()
  return day >= 27 || day <= 2
}

// Set the upcoming month to display the next planned budget
const getNextMonthInfo = () => {
  const today = new Date()
  const next = new Date(today.getFullYear(), today.getMonth() + 1, 1)
  const month = next.toLocaleDateString('fr-FR', { month: 'long' })
  const key = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`
  return { label: month, key }
}

export function UpcomingBudgetAlert() {
  const navigate = useNavigate()

  if (!isInPreparationWindow()) return null
  const { label, key } = getNextMonthInfo()
  return (
    <Alert className="mb-6">
      <AlertTitle>Préparez votre budget de {label} !</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-2">
        Vous pouvez dès maintenant initialiser votre budget pour le mois de {label}.
        <Button
          className="w-fit"
          onClick={() => navigate(`/dashboard/budgets/init?month=${key}`)}
        >
          Initialiser {label}
        </Button>
      </AlertDescription>
    </Alert>
  )
}
