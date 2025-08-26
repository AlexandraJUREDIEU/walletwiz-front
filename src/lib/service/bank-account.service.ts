import { useApi } from "@/lib/api/useApi";
import type {
  BankAccount,
  CreateBankAccountDto,
  UpdateBankAccountDto,
  AddBankAccountMemberDto,
} from "@/types";

export function useBankAccountsService() {
  const { get, post, patch, del } = useApi();

  // Lister les comptes d'une session
  const getBySession = (sessionId: string) =>
    get<BankAccount[]>(`/bank-accounts/session/${sessionId}`);

  // Créer un compte
  const create = (data: CreateBankAccountDto) =>
    post<BankAccount>("/bank-accounts", data);

  // Mettre à jour (label, bankName, isArchived, etc.)
  const update = (id: string, data: UpdateBankAccountDto) =>
    patch<BankAccount>(`/bank-accounts/${id}`, data);

  // Supprimer (si exposé côté API; sinon, ignorer)
  const remove = (id: string) => del<void>(`/bank-accounts/${id}`);

  // Gestion des membres joints
  const addMember = (bankAccountId: string, data: AddBankAccountMemberDto) =>
    post<void>(`/bank-accounts/${bankAccountId}/members`, data);

  const removeMember = (bankAccountId: string, memberId: string) =>
    del<void>(`/bank-accounts/${bankAccountId}/members/${memberId}`);

  return {
    getBySession,
    create,
    update,
    remove,
    addMember,
    removeMember,
  };
}