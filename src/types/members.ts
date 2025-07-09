export type MemberRole = 'owner' | 'adult' | 'child';

export interface Member {
  id: string; // uuid
  firstName: string;
  lastName: string;
  email?: string;
  isReal: boolean; // fictif ou réel
  role: MemberRole;
  isOwner?: boolean; // utile pour distinguer le créateur du budget
  invited?: boolean; // si on prévoit une invitation plus tard
  createdAt: string;
}