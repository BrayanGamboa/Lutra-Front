import { forwardRef, useId, type InputHTMLAttributes } from 'react';

import { cn } from '@/components/ui/cn';

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helperText, id, label, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const messageId = `${inputId}-message`;

    return (
      <div className="space-y-1.5">
        {label ? (
          <label className="block text-sm font-medium text-slate-700" htmlFor={inputId}>
            {label}
          </label>
        ) : null}

        <input
          ref={ref}
          aria-describedby={error || helperText ? messageId : undefined}
          aria-invalid={Boolean(error)}
          className={cn(
            'block h-11 w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900',
            'placeholder:text-slate-400 focus:outline-none focus:ring-2',
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
              : 'border-slate-300 focus:border-sky-500 focus:ring-sky-200',
            className,
          )}
          id={inputId}
          {...props}
        />

        {error ? (
          <p className="text-sm text-rose-600" id={messageId}>
            {error}
          </p>
        ) : helperText ? (
          <p className="text-sm text-slate-500" id={messageId}>
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
