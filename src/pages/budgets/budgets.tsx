import { useNavigate } from "react-router-dom";
import { useBudgetStore } from "@/stores/budgetStore";
import { ActiveBudgetPanel } from "@/components/specifics/ActiveBudgetPanel";
import { UpcomingBudgetAlert } from "@/components/specifics/UpcomingBudgetAlert";
import { Button } from "@/components/ui/button";
import dayjs from "@/lib/dayjs";

export default function BudgetsPage() {
  const currentBudget = useBudgetStore((s) => s.getCurrentBudget());
  const navigate = useNavigate();
  // * Clé du mois courant pour les budgets
  const currentMonthKey = dayjs().format("YYYY-MM");

  // * Fonction de gestion du clic pour créer un nouveau budget
  const handleClick = () => {
    navigate(`/dashboard/budgets/init?month=${currentMonthKey}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Mes budgets</h1>
      {!currentBudget && (
        <div className="mt-6 flex justify-center">
          <Button onClick={handleClick}>
            Créer mon budget de {dayjs().format("MMMM YYYY")}
          </Button>
        </div>
      )}
      </div>
      <UpcomingBudgetAlert />
      <ActiveBudgetPanel />
      {/* Les autres sections viendront ici */}
    </div>
  );
}
