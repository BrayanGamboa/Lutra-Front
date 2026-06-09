import { z } from 'zod';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Correo requerido.')
    .email('Ingresa un correo válido.'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
