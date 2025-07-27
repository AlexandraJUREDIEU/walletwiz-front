export interface Session {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
}

export type Invite = {
  invitedEmail: string;
  role: 'OWNER' | 'ADULT' | 'CHILD';
  sessionId: string;
  sessionName: string;
  invitationStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED';
};

export type CreatePayload = {
  name: string;
};

export type InvitePayload = {
  email: string;
  role: 'OWNER' | 'ADULT' | 'CHILD';
  isReal: boolean;
};
