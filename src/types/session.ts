export type Session = {
  id: string
  name: string
  ownerId: string
  createdAt: string
}



export type CreatePayload = {
  name: string
}

export type InvitePayload = {
  email: string
  role: 'OWNER' | 'ADULT' | 'CHILD'
  isReal: boolean
}
