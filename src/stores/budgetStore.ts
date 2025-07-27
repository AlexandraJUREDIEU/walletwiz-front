import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Allocation, Budget } from '@/types/budgets';
import type { Transaction } from '@/types/transactions';
import type { Income } from '@/types/incomes';
import type { Expense } from '@/types/expenses';

type BudgetStore = {
  budgets: Budget[];
  getBudgetByMonth: (month: string) => Budget | undefined;
  getAvailableByCategory: (month: string) => Record<string, number>;
  getCurrentBudget: () => Budget | undefined;
  getLastBudgets: (count: number) => Budget[];
  initNewBudget: (
    month: string,
    allocations: Allocation[],
    incomes?: Income[],
    expenses?: Expense[]
  ) => void;
  addTransaction: (month: string, transaction: Transaction) => void;
  removeTransaction: (month: string, transactionId: string) => void;
};

// 🧠 Zustand Store
export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      budgets: [],

      getBudgetByMonth: (month) => {
        return get().budgets.find((b) => b.month === month);
      },

      getAvailableByCategory: (month) => {
        const budget = get().budgets.find((b) => b.month === month);
        if (!budget) return {};

        const totals: Record<string, number> = {};
        const initial = budget.allocations.reduce(
          (acc, a) => {
            acc[a.category] = a.amount;
            return acc;
          },
          {} as Record<string, number>
        );

        for (const a of budget.allocations) {
          const spent = budget.transactions
            .filter((t) => t.category === a.category && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
          totals[a.category] = initial[a.category] - spent;
        }

        return totals;
      },

      getCurrentBudget: () => {
        const today = new Date();
        const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        return get().budgets.find((b) => b.month === monthKey);
      },

      getLastBudgets: (count) => {
        return [...get().budgets].sort((a, b) => (a.month < b.month ? 1 : -1)).slice(0, count);
      },

      initNewBudget: (month, allocations) => {
        const alreadyExists = get().budgets.some((b) => b.month === month);
        if (alreadyExists) return;

        const newBudget: Budget = {
          id: uuidv4(),
          month,
          createdAt: new Date().toISOString(),
          allocations,
          incomes: [],
          expenses: [],
          transactions: [],
        };

        set((state) => ({
          budgets: [...state.budgets, newBudget],
        }));
      },

      addTransaction: (month, transaction) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.month === month ? { ...b, transactions: [...b.transactions, transaction] } : b
          ),
        }));
      },

      removeTransaction: (month, transactionId) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.month === month
              ? {
                  ...b,
                  transactions: b.transactions.filter((t) => t.id !== transactionId),
                }
              : b
          ),
        }));
      },
    }),
    {
      name: 'walletwiz-budgets', // Clé du localStorage
    }
  )
);
