import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Transaction } from '@/types/transactions'
import { v4 as uuid } from 'uuid'

type TransactionStore = {
  transactions: Transaction[]
  addTransaction: (data: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, data: Partial<Omit<Transaction, 'id'>>) => void
  deleteTransaction: (id: string) => void
  getTransactionsForBudget: (month: string) => Transaction[]
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction: (data) => {
        const newTransaction: Transaction = { id: uuid(), ...data }
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }))
      },

      updateTransaction: (id, data) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...data } : t
          ),
        }))
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }))
      },

      getTransactionsForBudget: (month) => {
        return get().transactions.filter((t) => t.budgetMonth === month)
      },
    }),
    {
      name: 'walletwiz-transactions',
    }
  )
)