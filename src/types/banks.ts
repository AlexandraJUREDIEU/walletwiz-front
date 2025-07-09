export interface BankAccount {
  id: string
  name: string
  bankName: string
  memberIds: string[] // ID des membres rattachés
  createdAt: string
  updatedAt: string
}