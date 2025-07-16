import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Expense } from '@/types/expenses'; // Adjust the import path as necessary
import { v4 as uuidv4 } from 'uuid';

interface ExpenseStore {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, data: Partial<Expense>) => void;
  removeExpense: (id: string) => void;
  getTotalAmount: () => number;
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      expenses: [],
      addExpense: (expense) => {
        const newExpense: Expense = {
          ...expense,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ expenses: [...state.expenses, newExpense] }));
      },
      updateExpense: (id, data) => {
        set((state) => ({
          expenses: state.expenses.map((exp) =>
            exp.id === id ? { ...exp, ...data } : exp
          ),
        }));
      },
      removeExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((exp) => exp.id !== id),
        }));
      },
      getTotalAmount: () => {
        return get().expenses.reduce((sum, exp) => sum + exp.amount, 0);
      },
    }),
    {
      name: 'walletwiz-expenses',
    }
  )
);
