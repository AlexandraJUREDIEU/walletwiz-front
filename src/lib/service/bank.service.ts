import type { AddBankPayload, BankAccount } from '@/types/banks';
import { useApi } from '../useApi';

export function useBankService() {
  const { request } = useApi();

  // 🔹 Service pour la consultation des banques
  const getBanks = async () => {
    return await request<BankAccount[]>('/bank-account', {
      method: 'GET',
    });
  };
  // 🔹 Service pour l'ajout d'une banque
  const addBank = async (data: AddBankPayload) => {
    return await request<AddBankPayload>('/bank-account', {
      method: 'POST',
      data: data,
    });
  };

  return {
    getBanks,
    addBank,
  };
}
