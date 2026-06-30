import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

import { cn } from '@/components/ui/cn';
import { OtterMascot } from '@/components/OtterMascot';
import { useDebounce } from '@/shared/hooks/useDebounce';

export interface SearchableSelectOption {
  value: number | string;
  label: string;
  description?: string;
}

export interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: number | string | null | undefined;
  onChange: (value: number | string | null) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  isLoading?: boolean;
  disabled?: boolean;
  clearable?: boolean;
}

export const SearchableSelect = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Selecciona una opción...',
  error,
  isLoading = false,
  disabled = false,
  clearable = false,
}: SearchableSelectProps): JSX.Element => {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((o) => o.value === value) ?? null;

  const filteredOptions = options
    .filter((o) => {
      if (!debouncedSearch) return true;
      const q = debouncedSearch.toLowerCase();
      return (
        o.label.toLowerCase().includes(q) ||
        (o.description?.toLowerCase().includes(q) ?? false)
      );
    })
    .slice(0, 50);

  // Cierra el dropdown si se hace clic fuera del componente
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  // Enfoca el input de búsqueda cuando se abre el dropdown
  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSelect = (option: SearchableSelectOption): void => {
    onChange(option.value);
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onChange(null);
  };

  const handleToggle = (): void => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    if (isOpen) setSearch('');
  };

  return (
    <div className="space-y-1.5" ref={containerRef}>
      {label ? (
        <label className="block text-sm font-medium text-slate-700" htmlFor={id}>
          {label}
        </label>
      ) : null}

      <div className="relative">
        <button
          id={id}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={cn(
            'w-full rounded-xl border bg-white px-3 py-2 text-sm text-left flex items-center justify-between gap-2',
            'hover:border-slate-300 focus:outline-none focus:ring-2 transition-colors',
            'disabled:cursor-not-allowed disabled:opacity-60',
            error
              ? 'border-rose-500 focus:ring-rose-500'
              : 'border-slate-200 focus:ring-sky-500',
          )}
          onClick={handleToggle}
        >
          <span className={cn('truncate', !selectedOption && 'text-slate-400')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <span className="flex shrink-0 items-center gap-1">
            {clearable && selectedOption ? (
              <span
                role="button"
                aria-label="Limpiar selección"
                tabIndex={0}
                className="rounded p-0.5 hover:bg-slate-100"
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleClear(e as unknown as React.MouseEvent);
                }}
              >
                <X className="h-3.5 w-3.5 text-slate-400" />
              </span>
            ) : null}
            <ChevronDown
              className={cn(
                'h-4 w-4 text-slate-400 transition-transform',
                isOpen && 'rotate-180',
              )}
            />
          </span>
        </button>

        {isOpen ? (
          <div className="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-xl max-h-64 overflow-hidden flex flex-col">
            <div className="sticky top-0 border-b border-slate-100 bg-white p-2">
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                className={cn(
                  'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm',
                  'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500',
                )}
              />
            </div>

            <div className="overflow-y-auto" role="listbox">
              {isLoading ? (
                <div className="space-y-1 p-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-8 animate-pulse rounded-lg bg-slate-100"
                    />
                  ))}
                </div>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <div
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      className={cn(
                        'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm',
                        isSelected
                          ? 'bg-sky-50 font-medium text-sky-700'
                          : 'text-slate-700 hover:bg-sky-50',
                      )}
                      onClick={() => handleSelect(option)}
                    >
                      <span className="w-4 shrink-0">
                        {isSelected ? <Check className="h-3.5 w-3.5 text-sky-600" /> : null}
                      </span>
                      <span className="flex flex-col">
                        <span>{option.label}</span>
                        {option.description ? (
                          <span className="text-xs text-slate-400">{option.description}</span>
                        ) : null}
                      </span>
                    </div>
                  );
                })
              ) : (
                <OtterMascot variant="empty" message="Sin resultados." size="sm" />
              )}
            </div>
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="text-sm text-rose-600">{error}</p>
      ) : null}
    </div>
  );
};
