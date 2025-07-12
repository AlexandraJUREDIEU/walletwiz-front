export type ExpenseFrequency = 'monthly' | 'quarterly' | 'yearly';

export type ExpenseCategory =
  | 'housing'
  | 'utilities'
  | 'subscriptions'
  | 'insurance'
  | 'transport'
  | 'other';

export interface Expense {
  id: string;
  label: string;
  amount: number;
  dueDay: number; // entre 1 et 31
  frequency: ExpenseFrequency;
  category: ExpenseCategory;
  memberIds: string[]; // UUIDs des membres rattachés
  bankId: string; // UUID de la banque
  createdAt: string;
}
