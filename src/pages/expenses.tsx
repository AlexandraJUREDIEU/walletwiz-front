import { useState } from 'react';
import { useExpenseStore } from '@/stores/expenseStore';
import { useMemberStore } from '@/stores/memberStore';
import { useBankStore } from '@/stores/bankStore';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Expense } from '@/types/expenses';
import { ExpenseForm } from '@/components/forms/ExpenseForm';

export default function ExpensesPage() {
  const expenses = useExpenseStore((s) => s.expenses);
  const removeExpense = useExpenseStore((s) => s.removeExpense);
  const total = useExpenseStore((s) => s.getTotalAmount());

  const members = useMemberStore((s) => s.members);
  const banks = useBankStore((s) => s.banks);

  const [openEdit, setOpenEdit] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const handleEditClick = (expense: Expense) => {
    setExpenseToEdit(expense);
    setOpenEdit(true);
  };

    return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Charges fixes</h1>

      {/* Ajout Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button>+ Ajouter une charge</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une charge</DialogTitle>
          </DialogHeader>
          <ExpenseForm onSuccess={(shouldClose) => shouldClose && setOpenEdit(false)} />
        </DialogContent>
      </Dialog>

      {/* Édition Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la charge</DialogTitle>
          </DialogHeader>
          {expenseToEdit && (
            <ExpenseForm
              expenseToEdit={expenseToEdit}
              onSuccess={(shouldClose) => shouldClose && setOpenEdit(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Liste des dépenses */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des charges ({expenses.length})</CardTitle>
          <p className="text-sm text-muted-foreground">
            Total mensuel : {total.toFixed(2)} €
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {expenses.length === 0 && (
            <p className="text-sm">Aucune charge enregistrée.</p>
          )}
          {expenses.map((exp) => {
            const memberNames = exp.memberIds
              .map((id) => members.find((m) => m.id === id)?.firstName)
              .filter(Boolean)
              .join(", ");

            const bankName = banks.find((b) => b.id === exp.bankId)?.name ?? "—";

            return (
              <div
                key={exp.id}
                className="border rounded-xl p-4 flex flex-col md:flex-row md:justify-between gap-2"
              >
                <div>
                  <p className="font-medium">{exp.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {exp.amount.toFixed(2)} € • {exp.category} • jour {exp.dueDay} • {exp.frequency}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Responsables : {memberNames}
                  </p>
                  <p className="text-sm text-muted-foreground">Banque : {bankName}</p>
                </div>
                <div className="flex gap-2 self-start md:self-center">
                  <Button size="sm" variant="outline" onClick={() => handleEditClick(exp)}>
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeExpense(exp.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
