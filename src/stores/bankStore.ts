import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BankAccount } from '@/types/banks';
import { v4 as uuid } from 'uuid';

interface BankState {
  banks: BankAccount[];
  addBank: (bank: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBank: (id: string, bank: Partial<BankAccount>) => void;
  deleteBank: (id: string) => void;
}

export const useBankStore = create<BankState>()(
  persist(
    (set) => ({
      banks: [],
      addBank: (bank) =>
        set((state) => ({
          banks: [
            ...state.banks,
            {
              id: uuid(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              ...bank,
            },
          ],
        })),
      updateBank: (id, bank) =>
        set((state) => ({
          banks: state.banks.map((b) =>
            b.id === id ? { ...b, ...bank, updatedAt: new Date().toISOString() } : b
          ),
        })),
      deleteBank: (id) =>
        set((state) => ({
          banks: state.banks.filter((b) => b.id !== id),
        })),
    }),
    {
      name: 'walletwiz-banks',
    }
  )
);
