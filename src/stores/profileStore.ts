import type { Profile } from '@/types/profile';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ProfileStore = {
  profile: Profile | null;
  setProfile: (data: Profile) => void;
  updateProfile: (data: Partial<Profile>) => void;
  clearProfile: () => void;
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (data) => set({ profile: data }),
      updateProfile: (data) =>
        set((state) => ({
          profile: { ...state.profile, ...data } as Profile,
        })),
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: 'walletwiz-profile',
    }
  )
);
