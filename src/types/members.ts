
export type Member = {
  id: string;
  sessionId?: string | null;
  userId?: string | null;
  name?: string | null;
  role?: "OWNER" | "COLLABORATOR" | "VIEWER";
  isPlaceholder?: boolean;
  invitationStatus?: "PENDING" | "ACCEPTED" | "DECLINED";
  invitedEmail?: string | null;
  inviteToken?: string | null;
  invitedAt?: string | null;
  acceptedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};