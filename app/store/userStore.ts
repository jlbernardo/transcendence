import { create } from "zustand/react";
import { persist, createJSONStorage } from "zustand/middleware"; // persist to store in localStorage
import { Profile } from '@/types/user'

interface UserStore {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
};

export function useUserStore() {
    return create<UserStore>()(
        persist(
            (set) => ({
                profile: null,
                setProfile: (user) => set({ profile: user }),
                token: null,
                setToken: (token) => set({ token }),
                logout: () => set({ profile: null, token: null }),
            }),
        {
            name: 'user-storage', // key in localStorage
            storage: createJSONStorage(() => localStorage), // localStorage
        }
    )
);}