import { Activity, CreditCard, ShieldCheck } from 'lucide-react';

import { useAuthStore, type AuthState } from '@/features/auth/authStore';

const overviewCards = [
  {
    title: 'Autenticación centralizada',
    description: 'JWT compartido entre features mediante interceptores Axios.',
    icon: ShieldCheck,
  },
  {
    title: 'Facturación lista para extender',
    description: 'Hooks, services y store aislados por dominio de negocio.',
    icon: CreditCard,
  },
  {
    title: 'Operación escalable',
    description: 'Arquitectura feature-driven para crecer sin acoplar UI, estado y API.',
    icon: Activity,
  },
];

export const HomePage = (): JSX.Element => {
  const user = useAuthStore((state: AuthState) => state.user);

  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold">
          Bienvenido{user?.name ? `, ${user.name}` : ''}.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          Base frontend preparada para conectarse con microservicios de autenticación y
          facturación sin mezclar responsabilidades.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {overviewCards.map(({ description, icon: Icon, title }) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
