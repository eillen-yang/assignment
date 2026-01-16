import { create } from "zustand";

export interface User {
  id: string;
  username: string;
  name: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;

  login: (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }) => void;

  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

  login: ({ user, accessToken, refreshToken }) => {
    set({ user, accessToken });
  },

  setAccessToken: (accessToken) => set({ accessToken }),

  logout: () => {
    set({ user: null, accessToken: null });
  },
}));
