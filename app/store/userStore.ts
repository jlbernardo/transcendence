import { create } from "zustand/react";
import { persist, createJSONStorage } from "zustand/middleware"; // persist to store in localStorage
import { Profile } from '@/types/user'
import { setTokenInHeader } from '@/lib/axios_instance';

interface UserStore {
    profile: Profile | null;
    setProfile: (profile: Profile | null) => void;
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => void;
    hydrated: boolean;
};

export const useUserStore = create<UserStore>()(
        persist(
            (set) => ({
                profile: null,
                setProfile: (user) => set({ profile: user }),
                token: null,
                setToken: (token) => {
                    setTokenInHeader(token);
                    set({ token });
                },
                logout: () => {
                    setTokenInHeader(null);
                    set({ profile: null, token: null });
                },
                hydrated: false,
            }),
        {
            name: 'user-storage', // key in localStorage
            storage: createJSONStorage(() => localStorage), // localStorage
            onRehydrateStorage: () => (state) => { // avoid flash of pages before hydration
                if (state) {
                    // restore token to axios headers after rehydration
                    setTokenInHeader(state.token);
                    state.hydrated = true;
                }
            },
        }
    )
);