import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Member} from '@/types/members';
import { v4 as uuidv4 } from 'uuid';

interface MemberStore {
  members: Member[];
  addMember: (member: Omit<Member, 'id' | 'createdAt'>) => void;
  updateMember: (id: string, data: Partial<Member>) => void;
  deleteMember: (id: string) => void;
}

export const useMemberStore = create<MemberStore>()(
  persist(
    (set) => ({
      members: [],
      addMember: (member) =>
        set((state) => ({
          members: [
            ...state.members,
            {
              ...member,
              id: uuidv4(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateMember: (id, data) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === id ? { ...m, ...data } : m
          ),
        })),
      deleteMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
        })),
    }),
    { name: 'walletwiz-members' }
  )
);