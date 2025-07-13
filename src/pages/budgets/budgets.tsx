import { ActiveBudgetPanel } from "@/components/specifics/ActiveBudgetPanel";
import { PreviousBudgets } from "@/components/specifics/PreviousBudgets";
import { UpcomingBudgetAlert } from "@/components/specifics/UpcomingBudgetAlert";


export default function BudgetsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Mes budgets</h1>
      <UpcomingBudgetAlert />
      <ActiveBudgetPanel />
      <PreviousBudgets />
      {/* Les autres sections viendront ici */}
    </div>
  );
}
