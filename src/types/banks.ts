import type { Member } from "@/types";

export type BankAccount = {
  id: string;
  label: string;
  bankName?: string | null;
  sessionId: string;
  initialBalance?: number | null;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
  members?: [
    {
      memberId: string;
      member: Member;
    }
  ];
};

export type CreateBankAccountDto = {
  sessionId: string;
  label: string;
  bankName: string;
  initialBalance?: number | null;
  isArchived?: boolean;
  memberIds?: string[];
};

export type UpdateBankAccountDto = {
  label?: string;
  bankName?: string | null;
  initialBalance?: number | null;
  isArchived?: boolean;
}

export type AddBankAccountMemberDto = {
  memberId?: string;
  memberIds?: string[];
};