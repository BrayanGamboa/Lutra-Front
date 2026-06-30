import { Brain, TentTree, Zap } from 'lucide-react';

import otterImg from '@/assets/img/otter.png';
import { useAuthStore, type AuthState } from '@/features/auth/authStore';

const overviewCards = [
  {
    title: '¿Qué es lutra?',
    description: 'Lutra busca ser la solución a pequeños y medianos negocios que requieren facturación electrónica, ofreciendo una plataforma amigable y fácil de usar.',
    icon: TentTree,
  },
  {
    title: '¿Por qué una nutria como mascota?',
    description: 'Porque representa la adaptabilidad, la inteligencia, y la capacidad de prosperar en entornos cambiantes. También es uno de mis animales favoritos :)',
    icon: Brain,
  }, 
  {
    title: '¿Crees que la actitud influye en lo que hacemos?',
    description: 'Claro que sí, la actitud es un factor decisivo en cualquier proyecto. Una actitud positiva puede marcar la diferencia en la forma en que enfrentamos los desafíos y alcanzamos nuestras metas.',
    icon: Zap,
  }
];

export const HomePage = (): JSX.Element => {
  const user = useAuthStore((state: AuthState) => state.user);

  const displayName = user?.name
    ? `${user.name} ${user.lastName ?? ''}`.trim()
    : (user?.username ?? null);

  return (
    <section className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 text-white shadow-xl">
        <img
          src={otterImg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 -bottom-4 w-32 opacity-50 select-none"
        />
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold">
          Bienvenido{displayName ? `, ${displayName}` : ''}.
        </h1>
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
