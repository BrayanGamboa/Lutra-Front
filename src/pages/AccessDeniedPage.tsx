import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/Button';
import { OtterMascot } from '@/components/OtterMascot';

export const AccessDeniedPage = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-4">
      <OtterMascot
        variant="error"
        size="lg"
        message="No tienes permiso para acceder a esta página."
      />

      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Acceso denegado</h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Tu cuenta no tiene los permisos necesarios para ver este contenido. Contacta
          al administrador si crees que esto es un error.
        </p>
      </div>

      <Button tooltip='Volver al inicio' onClick={() => navigate('/', { replace: true })}></Button>
    </main>
  );
};
