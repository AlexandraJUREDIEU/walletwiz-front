import type { Member, BankAccount } from "@/types";

export type ExpenseId = string;

export type Expense = {
  id: ExpenseId;
  sessionId: string;
  memberId: string;
  bankAccountId: string;
  label: string;
  amount: string | number;
  day: number;
  category: "HOUSING" | "UTILITIES" | "HEALTH" | "FOOD" | "TRANSPORT" | "SUBSCRIPTIONS" | "OTHER";
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
  member?: Member;
  bankAccount?: BankAccount;
};

export type CreateExpenseDto = {
  sessionId: string;
  memberId: string;
  bankAccountId: string;
  label: string;
  amount: string;
  day: number;
  category: Expense["category"];
  isArchived?: boolean;
};

export type UpdateExpenseDto = Partial<
  Pick<Expense, "label" | "day" | "memberId" | "bankAccountId" | "isArchived" | "category">
> & {
  amount?: string;
};