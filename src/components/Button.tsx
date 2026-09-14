import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '@/components/ui/cn';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  tooltip?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-sky-600 text-white shadow-sm hover:bg-sky-700 focus-visible:ring-sky-500',
  secondary:
    'bg-slate-200 text-slate-900 hover:bg-slate-300 focus-visible:ring-slate-500',
  danger:
    'bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus-visible:ring-rose-500',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-4 text-sm',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      disabled,
      isLoading = false,
      size = 'lg',
      type = 'button',
      variant = 'primary',
      tooltip,
      ...props
    },
    ref,
  ) => (
    <div className="relative group">
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-60',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        disabled={disabled || isLoading}
        type={type}
        {...props}
      >
        {isLoading ? (
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          />
        ) : null}
        <span>{children}</span>
      </button>

      {tooltip ? (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block rounded bg-gray-800 px-2 py-1 text-xs text-white whitespace-nowrap">
          {tooltip}
        </span>
      ) : null}

    </div>
  ),
);

Button.displayName = 'Button';
