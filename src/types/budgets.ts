import type { Expense } from "./expenses"
import type { Income } from "./incomes"
import type { Transaction } from "./transactions"

export type Budget = {
  id: string
  month: string // format '2025-07'
  createdAt: string
  incomes?: Income[]
  expenses?: Expense[]
  allocations: Allocation[]
  transactions: Transaction[]
}

export type Allocation = {
  category: 'vital' | 'car' | 'leisure' | 'savings'
  amount: number
}




