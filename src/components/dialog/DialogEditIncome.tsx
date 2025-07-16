import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IncomesForm } from '@/components/forms/IncomeForm';
import type { Income } from '@/types/incomes';

interface Props {
  income: Income;
}

export const DialogEditIncome = ({ income }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Modifier</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le revenu</DialogTitle>
        </DialogHeader>
        <IncomesForm initial={income} onSubmitCallback={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};