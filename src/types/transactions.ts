export type Transaction = {
  id: string
  category: 'vital' | 'car' | 'leisure' | 'savings'
  label: string
  amount: number
  date: string // ISO
}