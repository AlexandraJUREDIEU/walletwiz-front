import { useApi } from "@/lib/api/useApi";
import type { Expense, CreateExpenseDto, UpdateExpenseDto } from "@/types";

export function useExpensesService() {
  const { get, post, patch, del } = useApi();

  const listBySession = (sessionId: string) =>
    get<Expense[]>(`/expenses/session/${sessionId}`);

  const create = (dto: CreateExpenseDto) =>
    post<Expense>("/expenses", dto);

  const update = (id: string, dto: UpdateExpenseDto) =>
    patch<Expense>(`/expenses/${id}`, dto);

  const remove = (id: string) =>
    del<void>(`/expenses/${id}`);

  // helpers d'archive
  const archive = (id: string) => update(id, { isArchived: true });
  const restore = (id: string) => update(id, { isArchived: false });

  return { listBySession, create, update, remove, archive, restore };
}