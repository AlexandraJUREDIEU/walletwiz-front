import type { MonthString } from "@/types";

export type TransactionId = string;
export type TransactionType = "INFLOW" | "OUTFLOW";
export type TransactionCategory =
  | "HOUSING" | "UTILITIES" | "HEALTH" | "FOOD"
  | "TRANSPORT" | "SUBSCRIPTIONS" | "OTHER";

export type Transaction = {
  id: TransactionId;
  sessionId: string;
  bankAccountId: string;
  memberId?: string | null;
  type: TransactionType;
  label: string;
  amount: string | number;       // UI peut manipuler number; API attend string
  date: string;                  // "YYYY-MM-DD"
  isCleared?: boolean;
  notes?: string | null;
  category?: TransactionCategory; // surtout pour OUTFLOW
  createdAt?: string;
  updatedAt?: string;
};

export type CreateTransactionDto = {
  sessionId: string;
  bankAccountId: string;
  memberId?: string | null;
  type: TransactionType;
  label: string;
  amount: string;                // API: "123.45"
  date: string;                  // "YYYY-MM-DD"
  category?: TransactionCategory;
  isCleared?: boolean;
  notes?: string | null;
};

export type UpdateTransactionDto = Partial<
  Pick<
    Transaction,
    | "label" | "date" | "memberId" | "bankAccountId"
    | "notes" | "isCleared" | "category" | "type"
  >
> & {
  amount?: string;               // API string si présent
};

// Petit helper utile dans le hook
export type DateRange = { from: string; to: string }; // "YYYY-MM-DD"
export type MonthRange = { month: MonthString };       // "YYYY-MM"
