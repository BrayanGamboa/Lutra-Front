import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/authStore';
import { loginUser } from '@/features/auth/services/authService';
import type {
  AuthResponse,
  LoginPayload,
  User,
} from '@/features/auth/types/auth.types';

interface ApiError {
  message?: string;
}

const getErrorMessage = (error: AxiosError<ApiError>): string =>
  error.response?.data?.message ?? error.message ?? 'No fue posible iniciar sesión.';

export const useLogin = (): {
  mutate: (payload: LoginPayload) => void;
  isPending: boolean;
  error: string | null;
} => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  


  const mutation = useMutation<AuthResponse, AxiosError<ApiError>, LoginPayload>({
    mutationFn: loginUser,
    onMutate: () => {
      setError(null);
    },
    onSuccess: ({ token, user: apiUser }) => {
      // Normalizamos los roles del usuario desde la respuesta de la API y el token JWT.
      let roleNames: string[] = apiUser.roles.map((r) => r.name);

      if (roleNames.length === 0) {
        try {
          const payloadBase64 = token.split('.')[1];
          const decoded = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))) as Record<string, unknown>;
          const claimKey = Object.keys(decoded).find((k) =>
            k === 'role' || k === 'roles' || k.endsWith('/role'),
          );
          if (claimKey !== undefined) {
            const raw = decoded[claimKey];
            roleNames = Array.isArray(raw)
              ? (raw as string[])
              : typeof raw === 'string'
                ? [raw]
                : [];
          }
        } catch {
          
        }
      }

      const normalizedUser: User = {
        userId: apiUser.userId,
        username: apiUser.username,
        email: apiUser.email,
        name: apiUser.name,
        lastName: apiUser.lastName,
        roles: roleNames,
      };

      useAuthStore.getState().login(normalizedUser, token);
      navigate('/home', { replace: true });
    },
    onError: (mutationError) => {
      setError(getErrorMessage(mutationError));
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error,
  };
};
