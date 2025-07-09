export interface Income {
  id: string;
  label: string;
  amount: number;
  date: string; // ISO string
  memberId: string; // 'self' ou un id de membre
}