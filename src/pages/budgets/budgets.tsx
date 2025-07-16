import { TransactionModal } from "@/components/dialog/TransactionModal";
import { ActiveBudgetPanel } from "@/components/specifics/ActiveBudgetPanel";
import { PreviousBudgets } from "@/components/specifics/PreviousBudgets";
import { UpcomingBudgetAlert } from "@/components/specifics/UpcomingBudgetAlert";
import { Button } from "@/components/ui/button";
import { useBankStore } from "@/stores/bankStore";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function BudgetsPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false)
  const bankAccounts = useBankStore((s) => s.banks);
  const budgetMonth = dayjs().format("YYYY-MM");
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Mes budgets</h1>
        <TransactionModal
          open={showModal}
          onClose={() => setShowModal(false)}
          currentBudgetMonth="2025-07"
          bankAccounts={bankAccounts}
        />
        <div>
        <Button onClick={() => navigate(`/dashboard/budgets/${budgetMonth}`)}>Voir le budget</Button>
        <Button onClick={() => setShowModal(true)}>Ajouter une transaction</Button>
        </div>
      </div>
      <UpcomingBudgetAlert />
      <ActiveBudgetPanel />
      <PreviousBudgets />
      {/* Les autres sections viendront ici */}
    </div>
  );
}
