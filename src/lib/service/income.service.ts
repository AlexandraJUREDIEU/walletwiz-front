import { useApi } from "@/lib/api/useApi";
import type { Income, CreateIncomeDto, UpdateIncomeDto } from "@/types";

export function useIncomesService() {
  const { get, post, patch, del } = useApi();

  /** Liste les revenus planifiés d'une session */
  const getBySession = (sessionId: string) =>
    get<Income[]>(`/incomes/session/${sessionId}`);

  /** Crée un revenu planifié */
  const create = (dto: CreateIncomeDto) =>
    post<Income>("/incomes", dto);

  /** Met à jour un revenu existant */
  const update = (incomeId: string, dto: UpdateIncomeDto) =>
    patch<Income>(`/incomes/${incomeId}`, dto);

  /** Supprime un revenu */
  const remove = (incomeId: string) =>
    del<{ success: boolean }>(`/incomes/${incomeId}`);

  return { getBySession, create, update, remove };
}