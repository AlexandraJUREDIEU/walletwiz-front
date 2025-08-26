// src/lib/service/budgets.service.ts
import { useApi } from "@/lib/api/useApi";
import type {
  Budget,
  BudgetSummary,
  CreateBudgetDto,
  MonthString,
  UpdateBudgetDto,
} from "@/types";

export function useBudgetsService() {
  const { get, post, patch, del } = useApi();

  // Liste des budgets d'une session
  const listBySession = (sessionId: string) =>
    get<Budget[]>(`/budgets/session/${sessionId}`);

  // Lire un budget d'un mois précis (retourne Budget ou 404 si absent)
  const getByMonth = (sessionId: string, month: MonthString) =>
    get<Budget>(`/budgets/session/${sessionId}?month=${month}`);

  // Créer un budget
  const create = (dto: CreateBudgetDto) =>
    post<Budget>("/budgets", dto);

  // Modifier (openingBalance, notes, locked)
  const update = (budgetId: string, dto: UpdateBudgetDto) =>
    patch<Budget>(`/budgets/${budgetId}`, dto);

  // Supprimer (facultatif pour QA)
  const remove = (budgetId: string) =>
    del<void>(`/budgets/${budgetId}`);

  // Résumé du mois (source unique pour la page) + fallback auto
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
