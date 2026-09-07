import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { OtterMascot } from '@/components/OtterMascot';
import { SearchBar } from '@/components/SearchBar';
import { SearchableSelect } from '@/components/SearchableSelect';
import { Table, type TableColumn } from '@/components/Table';
import { useAuthStore, type AuthState } from '@/features/auth/authStore';
import { usePaymentMethods } from '@/features/catalog/hooks/usePaymentMethods';
import { useCreateSale, useSales } from '@/features/sales/hooks/useSales';
import { useSaleDetails } from '@/features/sales/hooks/useSaleDetails';
import type { SaleDetailResponse, SaleResponse } from '@/features/sales/types/sales.types';
import { useUserSearch } from '@/features/users/hooks/useUserSearch';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { formatDate } from '@/shared/utils/formatDate';

const createSaleSchema = z.object({
  customerId: z.string().uuid('Debe ser un UUID válido.'),
  totalAmount: z.coerce.number().positive('El total debe ser mayor a 0.'),
  paymentMethodId: z.number().int().optional(),
});

type CreateSaleValues = z.infer<typeof createSaleSchema>;

const SELLER_ROLES = ['Administrador', 'Vendedor', 'Supervisor', 'Contador'];

const SaleDetailsModal = ({
  sale,
  onClose,
}: {
  sale: SaleResponse | null;
  onClose: () => void;
}): JSX.Element => {
  const { data: details = [], isLoading } = useSaleDetails(sale?.saleId ?? null);

  const detailColumns = useMemo<TableColumn<SaleDetailResponse>[]>(
    () => [
      { id: 'productId', header: 'Producto ID', cell: (d) => d.productId },
      { id: 'quantity', header: 'Cantidad', cell: (d) => d.quantity },
      { id: 'unitPrice', header: 'Precio unit.', cell: (d) => formatCurrency(d.unitPrice) },
      {
        id: 'subtotal',
        header: 'Subtotal',
        cell: (d) => (d.subtotal !== undefined ? formatCurrency(d.subtotal) : '—'),
      },
    ],
    [],
  );

  return (
    <Modal
      description="Líneas de detalle registradas para esta venta."
      open={sale !== null}
      title={sale ? `Venta ${sale.saleId.slice(0, 8)}…` : 'Detalle de venta'}
      onClose={onClose}
    >
      {sale ? (
        <div className="space-y-4">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-slate-500">Cliente ID</dt>
              <dd className="mt-0.5 break-all text-sm text-slate-900">{sale.customerId}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Total</dt>
              <dd className="mt-0.5 text-sm text-slate-900">
                {formatCurrency(sale.totalAmount)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Estado</dt>
              <dd className="mt-0.5 text-sm text-slate-900">{sale.status ?? '—'}</dd>
            </div>
            {sale.saleDate ? (
              <div>
                <dt className="text-sm font-medium text-slate-500">Fecha</dt>
                <dd className="mt-0.5 text-sm text-slate-900">{formatDate(sale.saleDate)}</dd>
              </div>
            ) : null}
          </dl>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Líneas de detalle</p>
            {isLoading ? (
              <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-8">
                <OtterMascot variant="loading" message="Cargando detalles..." size="sm" />
              </div>
            ) : (
              <Table
                columns={detailColumns}
                data={details}
                emptyMessage="Sin detalles registrados."
                rowKey={(d) => d.saleDetailId}
              />
            )}
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

export const SalesPage = (): JSX.Element => {
  const { data = [], isLoading, error } = useSales();
  const { mutate: createSale, isPending, error: createError } = useCreateSale();
  const { data: methods = [], isLoading: loadingMethods } = usePaymentMethods();
  const user = useAuthStore((s: AuthState) => s.user);
  const userRoles = useAuthStore((s: AuthState) => s.user?.roles ?? []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SaleResponse | null>(null);
  const [search, setSearch] = useState('');

  // Whether the current user can pick a customer (vs being locked to themselves)
  const canSelectCustomer = SELLER_ROLES.some((r) => userRoles.includes(r));

  // Search query for the customer selector (only used when canSelectCustomer)
  const [clientSearch, setClientSearch] = useState('');
  const { users: clientOptions, isLoading: loadingClients } = useUserSearch({
    search: clientSearch,
    rol: 'Cliente',
  });

  const customerSelectOptions = useMemo(
    () =>
      clientOptions.map((u) => ({
        value: u.userId,
        label: `${u.name} ${u.lastName} — ${u.username}`,
      })),
    [clientOptions],
  );

  const methodOptions = useMemo(
    () => methods.map((m) => ({ value: m.paymentMethodId, label: m.name })),
    [methods],
  );

  const filtered = useMemo(
    () =>
      data.filter((s) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          (s.status ?? '').toLowerCase().includes(q) ||
          s.customerId.toLowerCase().includes(q)
        );
      }),
    [data, search],
  );

  const getDefaultCustomerId = (): string =>
    canSelectCustomer ? '' : (user?.userId ?? '');

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateSaleValues>({
    resolver: zodResolver(createSaleSchema),
    defaultValues: { customerId: getDefaultCustomerId() },
  });

  const handleClose = (): void => {
    setIsModalOpen(false);
    setClientSearch('');
    reset({ customerId: getDefaultCustomerId() });
  };

  const onSubmit = (values: CreateSaleValues): void => {
    createSale(
      {
        customerId: values.customerId,
        totalAmount: values.totalAmount,
        paymentMethodId: values.paymentMethodId,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  const columns = useMemo<TableColumn<SaleResponse>[]>(
    () => [
      {
        id: 'saleId',
        header: 'ID',
        cell: (s) => (
          <button
            className="font-mono text-xs font-medium text-sky-600 hover:text-sky-700"
            type="button"
            onClick={() => setSelectedSale(s)}
          >
            {s.saleId.slice(0, 8)}…
          </button>
        ),
      },
      {
        id: 'customerId',
        header: 'Cliente ID',
        cell: (s) => (
          <span className="font-mono text-xs">{s.customerId.slice(0, 8)}…</span>
        ),
      },
      {
        id: 'totalAmount',
        header: 'Total',
        cell: (s) => formatCurrency(s.totalAmount),
      },
      {
        id: 'paymentMethodId',
        header: 'Método de pago',
        cell: (s) => s.paymentMethodId ?? '—',
      },
      {
        id: 'saleDate',
        header: 'Fecha',
        cell: (s) => (s.saleDate ? formatDate(s.saleDate) : '—'),
      },
      {
        id: 'status',
        header: 'Estado',
        cell: (s) => (
          <span className="inline-flex rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">
            {s.status ?? '—'}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Ventas</p>
          <h1 className="text-2xl font-semibold text-slate-900">Gestión de ventas</h1>
          <p className="max-w-2xl text-sm text-slate-500">
            Consulta y registra ventas realizadas en el sistema.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} tooltip='Agregar venta'>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-12">
          <OtterMascot variant="loading" message="Cargando datos..." size="md" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4">
          <OtterMascot variant="error" size="sm" />
          <p className="text-sm text-rose-700">{error.message}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            onReset={() => setSearch('')}
            placeholder="Buscar por estado o cliente..."
            filteredCount={filtered.length}
            totalCount={data.length}
          />
          <Table
            columns={columns}
            data={filtered}
            emptyMessage="No hay ventas registradas."
            rowKey={(s) => s.saleId}
          />
        </div>
      )}

      <Modal
        description="Completa los datos para registrar una nueva venta."
        open={isModalOpen}
        title="Nueva Venta"
        onClose={handleClose}
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Customer selector — searchable for sellers, locked for customers */}
          <Controller
            control={control}
            name="customerId"
            render={({ field }) =>
              canSelectCustomer ? (
                <SearchableSelect
                  label="Cliente"
                  options={customerSelectOptions}
                  value={field.value || null}
                  onChange={(v) => {
                    field.onChange(v ?? '');
                    // Reset internal search so the list stays fresh on next open
                  }}
                  error={errors.customerId?.message}
                  isLoading={loadingClients}
                  placeholder="Buscar cliente..."
                  clearable
                />
              ) : (
                <SearchableSelect
                  label="Cliente (cuenta actual)"
                  options={[
                    {
                      value: user?.userId ?? '',
                      label: `${user?.name ?? ''} ${user?.lastName ?? ''} — ${user?.username ?? ''}`,
                    },
                  ]}
                  value={field.value || null}
                  onChange={() => {
                    // no-op — disabled
                  }}
                  error={errors.customerId?.message}
                  disabled
                />
              )
            }
          />

          <Input
            error={errors.totalAmount?.message}
            label="Total"
            placeholder="0.00"
            type="number"
            step="0.01"
            {...register('totalAmount')}
          />

          <Controller
            control={control}
            name="paymentMethodId"
            render={({ field }) => (
              <SearchableSelect
                label="Método de pago (opcional)"
                options={methodOptions}
                value={field.value ?? null}
                onChange={(v) => field.onChange(v === null ? undefined : Number(v))}
                error={errors.paymentMethodId?.message}
                isLoading={loadingMethods}
                clearable
              />
            )}
          />

          {createError ? (
            <p className="text-sm text-rose-600">{createError}</p>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={handleClose}>
              Cancelar
            </Button>
            <Button isLoading={isPending} type="submit">
              Guardar
            </Button>
          </div>
        </form>
      </Modal>

      <SaleDetailsModal sale={selectedSale} onClose={() => setSelectedSale(null)} />
    </section>
  );
};
