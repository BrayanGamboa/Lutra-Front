import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
  placeholder?: string;
  totalCount?: number;
  filteredCount?: number;
}

export const SearchBar = ({
  value,
  onChange,
  onReset,
  placeholder = 'Buscar...',
  totalCount,
  filteredCount,
}: SearchBarProps): JSX.Element => {
  const showCounter =
    value.trim().length > 0 &&
    filteredCount !== undefined &&
    totalCount !== undefined;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-200 transition-all">
        <Search className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        {value.length > 0 ? (
          <button
            type="button"
            aria-label="Limpiar búsqueda"
            className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            onClick={onReset}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {showCounter ? (
        <p className="px-1 text-xs text-slate-500">
          {filteredCount} de {totalCount} resultados
        </p>
      ) : null}
    </div>
  );
};
