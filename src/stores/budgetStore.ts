import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

// 🧾 Types
export type BudgetCategory = 'vital' | 'car' | 'leisure' | 'savings'

export type Allocation = {
  category: BudgetCategory
  amount: number
}

export type Transaction = {
  id: string
  category: BudgetCategory
  label: string
  amount: number
  date: string // ISO string
}

export type Budget = {
  id: string
  month: string // format '2025-07'
  createdAt: string
  allocations: Allocation[]
  transactions: Transaction[]
}

type BudgetStore = {
  budgets: Budget[]
  getCurrentBudget: () => Budget | undefined
  getLastBudgets: (count: number) => Budget[]
  initNewBudget: (month: string, allocations: Allocation[]) => void
  addTransaction: (month: string, transaction: Transaction) => void
  removeTransaction: (month: string, transactionId: string) => void
}

// 🧠 Zustand Store
export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      budgets: [],

      getCurrentBudget: () => {
        const today = new Date()
        const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
        return get().budgets.find((b) => b.month === monthKey)
      },

      getLastBudgets: (count) => {
        return [...get().budgets]
          .sort((a, b) => (a.month < b.month ? 1 : -1))
          .slice(0, count)
      },

      initNewBudget: (month, allocations) => {
        const alreadyExists = get().budgets.some((b) => b.month === month)
        if (alreadyExists) return

        const newBudget: Budget = {
          id: uuidv4(),
          month,
          createdAt: new Date().toISOString(),
          allocations,
          transactions: []
        }

        set((state) => ({
          budgets: [...state.budgets, newBudget]
        }))
      },

      addTransaction: (month, transaction) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.month === month
              ? { ...b, transactions: [...b.transactions, transaction] }
              : b
          )
        }))
      },

      removeTransaction: (month, transactionId) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.month === month
              ? {
                  ...b,
                  transactions: b.transactions.filter((t) => t.id !== transactionId)
                }
              : b
          )
        }))
      }
    }),
    {
      name: 'walletwiz-budgets', // Clé du localStorage
    }
  )
)