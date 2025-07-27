export type AuthPayload = {
  email: string;
  password: string;
};

export type OtpPayload = {
  email: string;
  code: string;
};

export type User = {
  id: string;
  email: string;
  name?: string;
  status?: 'single' | 'couple' | 'family';
};
