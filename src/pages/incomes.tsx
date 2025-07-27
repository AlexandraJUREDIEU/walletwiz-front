import { IncomesForm } from '@/components/forms/IncomeForm';
import { IncomesList } from '@/layouts/IncomeList';

export default function IncomesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mes Revenus</h1>
      <IncomesForm />
      <IncomesList />
    </div>
  );
}
