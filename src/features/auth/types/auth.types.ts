import { z } from 'zod';

export interface UserRole {
  roleId: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFromApi {
  userId: string;
  username: string;
  email: string;
  name: string;
  lastName: string;
  roles: UserRole[];
}

export interface User {
  userId: string;
  username: string;
  email: string;
  name: string;
  lastName: string;
  roles: string[];
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  name: string;
  lastName: string;
}

export interface AuthResponse {
  user: UserFromApi;
  token: string;
}

export const loginFormSchema = z.object({
  username: z.string().trim().min(1, 'El usuario es requerido.'),
  password: z.string(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
