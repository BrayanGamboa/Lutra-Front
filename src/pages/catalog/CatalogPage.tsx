import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { SearchBar } from '@/components/SearchBar';
import { Table, type TableColumn } from '@/components/Table';
import {
  useCountries,
  useCreateCountry,
  useDeleteCountry,
} from '@/features/catalog/hooks/useCountries';
import {
  useDocumentTypes,
  useCreateDocumentType,
  useDeleteDocumentType,
} from '@/features/catalog/hooks/useDocumentTypes';
import {
  usePaymentMethods,
  useCreatePaymentMethod,
  useDeletePaymentMethod,
} from '@/features/catalog/hooks/usePaymentMethods';
import {
  useTaxRegimes,
  useCreateTaxRegime,
  useDeleteTaxRegime,
} from '@/features/catalog/hooks/useTaxRegimes';
import type {
  CountryResponse,
  DocumentTypeResponse,
  MethodPaymentResponse,
  TaxRegimeResponse,
} from '@/features/catalog/types/catalog.types';

type CatalogTab = 'countries' | 'document-types' | 'payment-methods' | 'tax-regimes';

const tabs: { id: CatalogTab; label: string }[] = [
  { id: 'countries', label: 'Países' },
  { id: 'document-types', label: 'Tipos de documento' },
  { id: 'payment-methods', label: 'Métodos de pago' },
  { id: 'tax-regimes', label: 'Regímenes fiscales' },
];

const nameOnlySchema = z.object({
  name: z.string().trim().min(1, 'Nombre requerido.'),
});

const taxRegimeSchema = z.object({
  name: z.string().trim().min(1, 'Nombre requerido.'),
  description: z.string().trim().min(1, 'Descripción requerida.'),
});

type NameOnlyValues = z.infer<typeof nameOnlySchema>;
type TaxRegimeValues = z.infer<typeof taxRegimeSchema>;

const NameOnlyForm = ({
  isPending,
  submitError,
  onSubmit,
  onCancel,
}: {
  isPending: boolean;
  submitError: string | null;
  onSubmit: (values: NameOnlyValues) => void;
  onCancel: () => void;
}): JSX.Element => {
  const { register, handleSubmit, formState: { errors } } = useForm<NameOnlyValues>({
    resolver: zodResolver(nameOnlySchema),
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input error={errors.name?.message} label="Nombre" placeholder="Nuevo registro" {...register('name')} />
      {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancelar</Button>
        <Button isLoading={isPending} type="submit">Guardar</Button>
      </div>
    </form>
  );
};

const TaxRegimeForm = ({
  isPending,
  submitError,
  onSubmit,
  onCancel,
}: {
  isPending: boolean;
  submitError: string | null;
  onSubmit: (values: TaxRegimeValues) => void;
  onCancel: () => void;
}): JSX.Element => {
  const { register, handleSubmit, formState: { errors } } = useForm<TaxRegimeValues>({
    resolver: zodResolver(taxRegimeSchema),
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input error={errors.name?.message} label="Nombre" placeholder="Régimen simplificado" {...register('name')} />
      <Input error={errors.description?.message} label="Descripción" placeholder="Descripción del régimen" {...register('description')} />
      {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancelar</Button>
        <Button isLoading={isPending} type="submit">Guardar</Button>
      </div>
    </form>
  );
};

const CountriesTab = (): JSX.Element => {
  const { data = [], isLoading, error } = useCountries();
  const { mutate: createCountry, isPending, error: createError } = useCreateCountry();
  const { mutate: deleteCountry } = useDeleteCountry();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      data.filter((c) =>
        !search.trim() ? true : c.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [data, search],
  );

  const columns: TableColumn<CountryResponse>[] = [
    { id: 'name', header: 'País', cell: (c) => c.name },
    {
      id: 'actions',
      header: '',
      cell: (c) => (
        <Button size="sm" variant="danger" onClick={() => deleteCountry(c.countryId)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsOpen(true)}><Plus className="h-4 w-4" />Nuevo País</Button>
      </div>
      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : error ? (
        <p className="text-sm text-rose-600">{error.message}</p>
      ) : (
        <>
          <SearchBar
            value={search}
            onChange={setSearch}
            onReset={() => setSearch('')}
            placeholder="Buscar por nombre..."
            filteredCount={filtered.length}
            totalCount={data.length}
          />
          <Table columns={columns} data={filtered} rowKey={(c) => c.countryId} emptyMessage="Sin países registrados." />
        </>
      )}
      <Modal open={isOpen} title="Nuevo País" onClose={() => setIsOpen(false)}>
        <NameOnlyForm
          isPending={isPending}
          submitError={createError}
          onSubmit={(v) => createCountry(v, { onSuccess: () => setIsOpen(false) })}
          onCancel={() => setIsOpen(false)}
        />
      </Modal>
    </div>
  );
};

const DocumentTypesTab = (): JSX.Element => {
  const { data = [], isLoading, error } = useDocumentTypes();
  const { mutate: createDocumentType, isPending, error: createError } = useCreateDocumentType();
  const { mutate: deleteDocumentType } = useDeleteDocumentType();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      data.filter((d) =>
        !search.trim() ? true : d.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [data, search],
  );

  const columns: TableColumn<DocumentTypeResponse>[] = [
    { id: 'name', header: 'Tipo', cell: (d) => d.name },
    {
      id: 'actions',
      header: '',
      cell: (d) => (
        <Button size="sm" variant="danger" onClick={() => deleteDocumentType(d.documentTypeId)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsOpen(true)}><Plus className="h-4 w-4" />Nuevo Tipo</Button>
      </div>
      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : error ? (
        <p className="text-sm text-rose-600">{error.message}</p>
      ) : (
        <>
          <SearchBar
            value={search}
            onChange={setSearch}
            onReset={() => setSearch('')}
            placeholder="Buscar por nombre..."
            filteredCount={filtered.length}
            totalCount={data.length}
          />
          <Table columns={columns} data={filtered} rowKey={(d) => d.documentTypeId} emptyMessage="Sin tipos de documento." />
        </>
      )}
      <Modal open={isOpen} title="Nuevo Tipo de Documento" onClose={() => setIsOpen(false)}>
        <NameOnlyForm
          isPending={isPending}
          submitError={createError}
          onSubmit={(v) => createDocumentType(v, { onSuccess: () => setIsOpen(false) })}
          onCancel={() => setIsOpen(false)}
        />
      </Modal>
    </div>
  );
};

const PaymentMethodsTab = (): JSX.Element => {
  const { data = [], isLoading, error } = usePaymentMethods();
  const { mutate: createPaymentMethod, isPending, error: createError } = useCreatePaymentMethod();
  const { mutate: deletePaymentMethod } = useDeletePaymentMethod();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      data.filter((p) =>
        !search.trim() ? true : p.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [data, search],
  );

  const columns: TableColumn<MethodPaymentResponse>[] = [
    { id: 'name', header: 'Método', cell: (p) => p.name },
    {
      id: 'actions',
      header: '',
      cell: (p) => (
        <Button size="sm" variant="danger" onClick={() => deletePaymentMethod(p.paymentMethodId)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsOpen(true)}><Plus className="h-4 w-4" />Nuevo Método</Button>
      </div>
      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : error ? (
        <p className="text-sm text-rose-600">{error.message}</p>
      ) : (
        <>
          <SearchBar
            value={search}
            onChange={setSearch}
            onReset={() => setSearch('')}
            placeholder="Buscar por nombre..."
            filteredCount={filtered.length}
            totalCount={data.length}
          />
          <Table columns={columns} data={filtered} rowKey={(p) => p.paymentMethodId} emptyMessage="Sin métodos de pago." />
        </>
      )}
      <Modal open={isOpen} title="Nuevo Método de Pago" onClose={() => setIsOpen(false)}>
        <NameOnlyForm
          isPending={isPending}
          submitError={createError}
          onSubmit={(v) => createPaymentMethod(v, { onSuccess: () => setIsOpen(false) })}
          onCancel={() => setIsOpen(false)}
        />
      </Modal>
    </div>
  );
};

const TaxRegimesTab = (): JSX.Element => {
  const { data = [], isLoading, error } = useTaxRegimes();
  const { mutate: createTaxRegime, isPending, error: createError } = useCreateTaxRegime();
  const { mutate: deleteTaxRegime } = useDeleteTaxRegime();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      data.filter((t) =>
        !search.trim() ? true : t.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [data, search],
  );

  const columns: TableColumn<TaxRegimeResponse>[] = [
    { id: 'name', header: 'Régimen', cell: (t) => t.name },
    { id: 'description', header: 'Descripción', cell: (t) => t.description },
    {
      id: 'actions',
      header: '',
      cell: (t) => (
        <Button size="sm" variant="danger" onClick={() => deleteTaxRegime(t.taxRegimeId)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsOpen(true)}><Plus className="h-4 w-4" />Nuevo Régimen</Button>
      </div>
      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : error ? (
        <p className="text-sm text-rose-600">{error.message}</p>
      ) : (
        <>
          <SearchBar
            value={search}
            onChange={setSearch}
            onReset={() => setSearch('')}
            placeholder="Buscar por nombre..."
            filteredCount={filtered.length}
            totalCount={data.length}
          />
          <Table columns={columns} data={filtered} rowKey={(t) => t.taxRegimeId} emptyMessage="Sin regímenes fiscales." />
        </>
      )}
      <Modal open={isOpen} title="Nuevo Régimen Fiscal" onClose={() => setIsOpen(false)}>
        <TaxRegimeForm
          isPending={isPending}
          submitError={createError}
          onSubmit={(v) => createTaxRegime(v, { onSuccess: () => setIsOpen(false) })}
          onCancel={() => setIsOpen(false)}
        />
      </Modal>
    </div>
  );
};

const tabContent: Record<CatalogTab, JSX.Element> = {
  countries: <CountriesTab />,
  'document-types': <DocumentTypesTab />,
  'payment-methods': <PaymentMethodsTab />,
  'tax-regimes': <TaxRegimesTab />,
};

export const CatalogPage = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<CatalogTab>('countries');

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Sistema</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Catálogos</h1>
        <p className="mt-1 text-sm text-slate-500">
          Administra los catálogos del sistema: países, tipos de documento, métodos de pago y regímenes fiscales.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex overflow-x-auto border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`shrink-0 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">{tabContent[activeTab]}</div>
      </div>
    </section>
  );
};
