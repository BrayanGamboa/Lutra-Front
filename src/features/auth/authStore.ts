import { create } from 'zustand';

import type { User } from '@/features/auth/types/auth.types';

const TOKEN_STORAGE_KEY = 'lutra:auth-token';

const readStoredToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
};

const persistToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
};

const clearStoredToken = (): void => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

const initialToken = readStoredToken();

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  token: initialToken,
  isAuthenticated: Boolean(initialToken),
  login: (user, token) => {
    persistToken(token);
    set({
      user,
      token,
      isAuthenticated: true,
    });
  },
  logout: () => {
    clearStoredToken();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));
