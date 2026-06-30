import { axiosClient } from '@/shared/lib/axiosClient';
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from '@/features/auth/types/auth.types';

export const loginUser = async (
  payload: LoginPayload,
): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>('auth/login', payload);
  return response.data;
};

export const registerUser = async (
  payload: RegisterPayload,
): Promise<void> => {
  await axiosClient.post('auth/register', payload);
};
