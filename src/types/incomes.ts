export type IncomeId = string;

export type Income = {
  id: IncomeId;
  sessionId: string;
  memberId: string;
  bankAccountId: string;
  label: string;
  amount: string; /** Stocké en base en Decimal → on transporte en string pour éviter les erreurs d'arrondi */
  day: number; /** Jour du mois (1–31) où le revenu est attendu */
  createdAt?: string;
  updatedAt?: string;
};

export type CreateIncomeDto = {
  sessionId: string;
  memberId: string;
  bankAccountId: string;
  label: string;
  amount: string; // ex. "2450.00"
  day: number;    // 1..31
};

export type UpdateIncomeDto = Partial<{
  memberId: string;
  bankAccountId: string;
  label: string;
  amount: string;
  day: number;
}>;
