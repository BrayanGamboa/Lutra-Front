import { axiosClient } from '@/shared/lib/axiosClient';
import type {
  AuthResponse,
  LoginPayload,
} from '@/features/auth/types/auth.types';

export const loginUser = async (
  payload: LoginPayload,
): Promise<AuthResponse> => {
  console.log('Enviando solicitud de login con payload:', payload);
  const response = await axiosClient.post<AuthResponse>('/auth/login', payload);
  
  return response.data;
};
