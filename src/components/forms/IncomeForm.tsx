import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useIncomeStore } from '@/stores/incomeStore';
import { useMemberStore } from '@/stores/memberStore';
import { useBankStore } from '@/stores/bankStore';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';
import type { Income } from '@/types/incomes';

interface IncomeFormProps {
  initial?: Income;
  onSubmitCallback?: () => void;
}
export const IncomesForm = ({ initial, onSubmitCallback }: IncomeFormProps) => {
  const addIncome = useIncomeStore((s) => s.addIncome);
  const updateIncome = useIncomeStore((s) => s.updateIncome);
  const members = useMemberStore((s) => s.members);
  const banks = useBankStore((s) => s.banks);

  const [form, setForm] = useState({
    label: '',
    amount: '',
    day: '',
    memberId: 'self',
    bankId: '',
  });

  useEffect(() => {
    if (initial) {
      setForm({
        label: initial.label,
        amount: initial.amount.toString(),
        day: initial.day.toString(),
        memberId: initial.memberId,
        bankId: initial.bankId,
      });
    }
  }, [initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.bankId) {
      alert('Merci de sélectionner un compte bancaire');
      return;
    }

    const income = {
      id: initial?.id || uuidv4(),
      label: form.label,
      amount: parseFloat(form.amount),
      day: parseInt(form.day),
      memberId: form.memberId,
      bankId: form.bankId,
    };

    if (initial) {
      updateIncome(income.id, income);
    } else {
      addIncome(income);
    }

    if (onSubmitCallback) onSubmitCallback();

    if (!initial) {
      setForm({ label: '', amount: '', day: '', memberId: 'self', bankId: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Label"
        value={form.label}
        onChange={(e) => setForm({ ...form, label: e.target.value })}
        required
      />

      <Input
        type="number"
        placeholder="Montant (€)"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        required
      />

      <Input
        type="number"
        placeholder="Jour du mois (1-31)"
        value={form.day}
        min={1}
        max={31}
        onChange={(e) => setForm({ ...form, day: e.target.value })}
        required
      />

      <select
        value={form.memberId}
        onChange={(e) => setForm({ ...form, memberId: e.target.value })}
        className="w-full border rounded px-3 py-2"
      >
        <option value="self">Moi</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.firstName} {m.lastName}
          </option>
        ))}
      </select>

      <select
        value={form.bankId}
        onChange={(e) => setForm({ ...form, bankId: e.target.value })}
        className="w-full border rounded px-3 py-2"
        required
      >
        <option value="">-- Sélectionner un compte bancaire --</option>
        {banks.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name} ({b.bankName})
          </option>
        ))}
      </select>

      <Button type="submit">{initial ? 'Modifier' : 'Ajouter'}</Button>
    </form>
  );
};
