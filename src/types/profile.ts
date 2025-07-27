export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'single' | 'in couple' | 'married';
  avatarUrl?: string;
};
