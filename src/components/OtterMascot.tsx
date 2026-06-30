import type { CSSProperties } from 'react';

import otterImg from '@/assets/img/otter.png';

export type OtterVariant = 'empty' | 'loading' | 'error' | 'success';

export interface OtterMascotProps {
  variant?: OtterVariant;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-12 w-12',
  md: 'h-20 w-20',
  lg: 'h-28 w-28',
};

const animationStyles: Record<OtterVariant, CSSProperties> = {
  loading: { animation: 'lutra-float 2s ease-in-out infinite' },
  error: { animation: 'lutra-shake 0.5s ease-in-out' },
  empty: {},
  success: { animation: 'lutra-pulse 1.5s ease-in-out infinite' },
};

const messageColorClasses: Record<OtterVariant, string> = {
  empty: 'text-slate-400',
  loading: 'text-slate-500',
  error: 'text-rose-500',
  success: 'text-emerald-600',
};

const defaultMessages: Record<OtterVariant, string> = {
  empty: 'No hay datos por aquí.',
  loading: 'Cargando...',
  error: 'Algo salió mal.',
  success: '¡Listo!',
};

export const OtterMascot = ({
  variant = 'empty',
  message,
  size = 'md',
}: OtterMascotProps): JSX.Element => (
  <div className="flex flex-col items-center gap-3 py-8">
    <img
      src={otterImg}
      alt="Lutra"
      className={sizeClasses[size]}
      style={animationStyles[variant]}
    />
    <p className={`text-sm font-medium ${messageColorClasses[variant]}`}>
      {message ?? defaultMessages[variant]}
    </p>
  </div>
);
