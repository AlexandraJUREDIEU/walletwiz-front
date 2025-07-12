import type { Transaction } from "./transactions"

export type Budget = {
  id: string
  month: string // format '2025-07'
  createdAt: string
  allocations: Allocation[]
  transactions: Transaction[]
}

export type Allocation = {
  category: 'vital' | 'car' | 'leisure' | 'savings'
  amount: number
}




