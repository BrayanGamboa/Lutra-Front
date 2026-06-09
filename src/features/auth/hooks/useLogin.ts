import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/authStore';
import { loginUser } from '@/features/auth/services/authService';
import type {
  AuthResponse,
  LoginPayload,
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
    onSuccess: ({ token, user }) => {
      useAuthStore.getState().login(user, token);
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
