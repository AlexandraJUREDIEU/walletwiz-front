export type TransactionCategory = 'vital' | 'car' | 'leisure' | 'savings';
export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: string;
  label: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string; // ISO
  budgetMonth: string; // ex: "2025-07"
  bankAccountId: string;
  memberId?: string;
};
