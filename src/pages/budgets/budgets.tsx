import { TransactionModal } from "@/components/dialog/TransactionModal";
import { ActiveBudgetPanel } from "@/components/specifics/ActiveBudgetPanel";
import { PreviousBudgets } from "@/components/specifics/PreviousBudgets";
import { UpcomingBudgetAlert } from "@/components/specifics/UpcomingBudgetAlert";
import { Button } from "@/components/ui/button";
import { useBankStore } from "@/stores/bankStore";
import { useState } from "react";


export default function BudgetsPage() {
  const [showModal, setShowModal] = useState(false)
  const bankAccounts = useBankStore((s) => s.banks);
  
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
        <Button onClick={() => setShowModal(true)}>Ajouter une transaction</Button>
      </div>
      <UpcomingBudgetAlert />
      <ActiveBudgetPanel />
      <PreviousBudgets />
      {/* Les autres sections viendront ici */}
    </div>
  );
}
