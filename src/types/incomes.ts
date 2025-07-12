export interface Income {
  id: string;
  label: string;
  amount: number;
  day: number; // 1 à 31
  memberId: string; // 'self' ou ID membre
  bankId: string;   // ID du compte bancaire
}