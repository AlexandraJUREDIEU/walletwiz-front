import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useExpenseStore } from "@/stores/expenseStore";

export const ExpensesSummary = () => {
  const expenses = useExpenseStore((s) => s.expenses);
  const total = useExpenseStore((s) => s.getTotalAmount());
  
  const totalCharges = total.toFixed(2);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Charges fixes</CardTitle>
        <CardDescription>
          Résumé mensuel des dépenses récurrentes
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-lg font-semibold">{totalCharges} €</p>
          <p className="text-sm text-muted-foreground">
            {expenses.length} charge(s) enregistrée(s)
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/expenses">Voir les charges</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
