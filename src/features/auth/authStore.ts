import { create } from 'zustand';

import type { User } from '@/features/auth/types/auth.types';

const TOKEN_STORAGE_KEY = 'lutra:auth-token';
const USER_STORAGE_KEY = 'lutra:auth-user';

const storage = {
  getToken: (): string | null =>
    typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_STORAGE_KEY) : null,
  setToken: (token: string): void =>
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token),
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(USER_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  },
  setUser: (user: User): void =>
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)),
  clear: (): void => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(USER_STORAGE_KEY);
  },
};

const initialToken = storage.getToken();
const initialUser = initialToken ? storage.getUser() : null;

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: Boolean(initialToken),
  login: (user, token) => {
    storage.setToken(token);
    storage.setUser(user);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    storage.clear();
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
