// src/lib/service/budgets.service.ts
import { useApi } from "@/lib/api/useApi";
import type {
  Budget,
  BudgetSummary,
  CreateBudgetDto,
  MonthString,
  UpdateBudgetDto,
} from "@/types";

function normId(input: string | { id?: string } | null | undefined): string {
  if (!input) return "";
  if (typeof input === "string") return input;
  if (typeof input.id === "string") return input.id;
  return ""; // on retourne "" => le client lèvera une erreur propre
}

export function useBudgetsService() {
  const { get, post, patch, del } = useApi();

  const listBySession = (sessionId: string) =>
    get<Budget[]>(`/budgets/session/${sessionId}`);

  const getByMonth = (sessionId: string, month: MonthString) =>
    get<Budget>(`/budgets/session/${sessionId}?month=${month}`);

  const create = (dto: CreateBudgetDto) =>
    post<Budget>("/budgets", dto);

  // ✅ tolère string OU objet {id}, évite /budgets/[object Object]
  const update = (
    budget: string | { id?: string },
    dto: UpdateBudgetDto
  ) => {
    const id = normId(budget);
    if (!id) {
      // Déclenche une erreur claire (toaster géré par useApi)
      throw new Error("Invalid budget id passed to update()");
    }
    return patch<Budget>(`/budgets/${id}`, dto);
  };

  // ✅ idem
  const remove = (budget: string | { id?: string }) => {
    const id = normId(budget);
    if (!id) {
      throw new Error("Invalid budget id passed to remove()");
    }
    return del<void>(`/budgets/${id}`);
  };

  const getSummary = (
    sessionId: string,
    month: MonthString,
    opts?: { createIfMissing?: boolean }
  ) => {
    const q = opts?.createIfMissing ? "?createIfMissing=true" : "";
    return get<BudgetSummary>(`/budgets/session/${sessionId}/${month}/summary${q}`);
  };

  return {
    listBySession,
    getByMonth,
    create,
    update,
    remove,
    getSummary,
  };
}
