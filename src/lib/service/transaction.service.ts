import { useApi } from "@/lib/api/useApi";
import type {
  CreateTransactionDto,
  UpdateTransactionDto,
  Transaction,
} from "@/types";

export function useTransactionsService() {
  const { get, post, patch, del } = useApi();

  // GET /transactions/session/{sessionId}[?from=YYYY-MM-DD&to=YYYY-MM-DD]
  // (Référence API) :contentReference[oaicite:2]{index=2}
  const listBySession = (sessionId: string, params?: { from?: string; to?: string }) => {
    const q = new URLSearchParams();
    if (params?.from) q.set("from", params.from);
    if (params?.to) q.set("to", params.to);
    const suffix = q.toString() ? `?${q.toString()}` : "";
    return get<Transaction[]>(`/transactions/session/${sessionId}${suffix}`);
  };

  // POST /transactions (INFLOW/OUTFLOW) :contentReference[oaicite:3]{index=3}
  const create = (dto: CreateTransactionDto) =>
    post<Transaction>("/transactions", dto);

  // PATCH /transactions/{id} (mise à jour/changement cleared) :contentReference[oaicite:4]{index=4}
  const update = (id: string, dto: UpdateTransactionDto) =>
    patch<Transaction>(`/transactions/${id}`, dto);

  // DELETE /transactions/{id} :contentReference[oaicite:5]{index=5}
  const remove = (id: string) => del<void>(`/transactions/${id}`);

  return { listBySession, create, update, remove };
}
