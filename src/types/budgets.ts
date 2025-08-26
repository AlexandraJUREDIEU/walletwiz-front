export type MonthString = string // "YYYY-MM"

export type BudgetId = string;

export type Budget = {
  id: BudgetId;
  sessionId: string;
  month: MonthString;             // "YYYY-MM"
  openingBalance: string;         // API convention: string "1234.56"
  notes?: string | null;
  locked?: boolean;               // lock/unlock
  createdAt?: string;
  updatedAt?: string;
};

export type CreateBudgetDto = {
  sessionId: string;
  month: MonthString;
  openingBalance: string;         // "1234.56"
  notes?: string | null;
};

export type UpdateBudgetDto = Partial<Pick<Budget, "openingBalance" | "notes" | "locked">>;

export type BudgetSummary = {
  sessionId: string;
  month: MonthString;
  budget?: BudgetId | null      // présent si un budget existe déjà
  openingBalance: string;         // "1234.56"
  plannedIncome: string;          // agrégé depuis incomes/expenses
  plannedExpense: string;         // agrégé depuis incomes/expenses
  netPlanned: string;              // plannedIncome - plannedExpense
  projectedEndBalance: string;    // openingBalance + netPlanned
  actualInFlow: string;                 // agrégé depuis transactions
  actualOutFlow: string;                // agrégé depuis transactions
  netActual: string;                     // actualInFlow - actualOutFlow
  endingBalance: string;                 // projectedEndBalance + netActual
  clearedInFlow: string;                   // agrégé depuis transactions
  clearedOutFlow: string;                  // agrégé depuis transactions
  netCleared: string;                     // clearedInFlow - clearedOutFlow
  clearedEndingBalance: string;          // endingBalance + netCleared
};
