import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useLogin } from '@/features/auth/hooks/useLogin';
import {
  loginFormSchema,
  type LoginFormValues,
} from '@/features/auth/types/auth.types';

export const LoginForm = (): JSX.Element => {
  const { mutate: login, isPending, error } = useLogin();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginFormValues): void => {
    login(values);
  };

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Input
        autoComplete="username"
        error={errors.username?.message}
        label="Usuario"
        placeholder="usuario o correo"
        type="text"
        {...register('username')}
      />

      <Input
        autoComplete="current-password"
        error={errors.password?.message}
        label="Contraseña"
        placeholder="••••••••"
        type="password"
        {...register('password')}
      />

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <Button className="w-full" isLoading={isPending} type="submit" tooltip='Ingresar'>
        Ingresar
      </Button>
    </form>
  );
};
