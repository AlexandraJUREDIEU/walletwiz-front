export type Profile = {
  id: string
  name: string
  email: string
  status: 'single' | 'in couple' | 'married'
  avatarUrl?: string
}