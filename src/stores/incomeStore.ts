import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Income } from '@/types/incomes';

interface IncomesState {
  incomes: Income[];
  addIncome: (income: Income) => void;
  updateIncome: (id: string, updated: Partial<Income>) => void;
  deleteIncome: (id: string) => void;
  getTotal: () => number;
}

export const useIncomesStore = create<IncomesState>()(
  persist(
    (set, get) => ({
      incomes: [],
      addIncome: (income) =>
        set((state) => ({ incomes: [...state.incomes, income] })),
      updateIncome: (id, updated) =>
        set((state) => ({
          incomes: state.incomes.map((income) =>
            income.id === id ? { ...income, ...updated } : income
          ),
        })),
      deleteIncome: (id) =>
        set((state) => ({
          incomes: state.incomes.filter((income) => income.id !== id),
        })),
      getTotal: () =>
        get().incomes.reduce((total, income) => total + income.amount, 0),
    }),
    {
      name: 'walletwiz-incomes',
    }
  )
);