import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Table, type TableColumn } from '@/components/Table';
import {
  useBillingStore,
  type BillingState,
} from '@/features/billing/billingStore';
import { InvoiceForm } from '@/features/billing/components/InvoiceForm';
import { useGetInvoices } from '@/features/billing/hooks/useGetInvoices';
import type { Invoice } from '@/features/billing/types/billing.types';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { formatDate } from '@/shared/utils/formatDate';

const statusLabels: Record<Invoice['status'], string> = {
  draft: 'Borrador',
  sent: 'Enviada',
  paid: 'Pagada',
  cancelled: 'Cancelada',
};

export const InvoicesPage = (): JSX.Element => {
  const closeCreateModal = useBillingStore(
    (state: BillingState) => state.closeCreateModal,
  );
  const isCreateModalOpen = useBillingStore(
    (state: BillingState) => state.isCreateModalOpen,
  );
  const openCreateModal = useBillingStore(
    (state: BillingState) => state.openCreateModal,
  );
  const selectedInvoice = useBillingStore(
    (state: BillingState) => state.selectedInvoice,
  );
  const setSelectedInvoice = useBillingStore(
    (state: BillingState) => state.setSelectedInvoice,
  );
  const { data = [], error, isLoading } = useGetInvoices();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  const columns = useMemo<TableColumn<Invoice>[]>(
    () => [
      {
        id: 'number',
        header: 'Consecutivo',
        cell: (invoice) => (
          <button
            className="font-medium text-sky-600 hover:text-sky-700"
            type="button"
            onClick={() => setSelectedInvoice(invoice)}
          >
            {invoice.number}
          </button>
        ),
      },
      {
        id: 'clientName',
        header: 'Cliente',
        cell: (invoice) => invoice.clientName,
      },
      {
        id: 'status',
        header: 'Estado',
        cell: (invoice) => statusLabels[invoice.status],
      },
      {
        id: 'total',
        header: 'Total',
        cell: (invoice) => formatCurrency(invoice.total),
      },
      {
        id: 'createdAt',
        header: 'Fecha',
        cell: (invoice) => formatDate(invoice.createdAt),
      },
    ],
    [setSelectedInvoice],
  );

  const filteredInvoices = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();

    if (!term) {
      return data;
    }

    return data.filter((invoice) =>
      [invoice.number, invoice.clientName, invoice.status].some((value) =>
        value.toLowerCase().includes(term),
      ),
    );
  }, [data, debouncedSearch]);

  const errorMessage =
    error?.response?.data?.message ?? error?.message ?? 'No fue posible cargar facturas.';

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Billing</p>
          <h1 className="text-2xl font-semibold text-slate-900">Gestión de facturas</h1>
          <p className="max-w-2xl text-sm text-slate-500">
            Consulta documentos emitidos y registra nuevas facturas desde módulo desacoplado.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <Input
            className="min-w-[260px]"
            helperText="Busca por consecutivo, cliente o estado."
            label="Buscar"
            placeholder="Ej. FE-1024"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <Button className="sm:self-end" onClick={openCreateModal} tooltip='Agregar factura'>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 text-sm text-slate-500">
          Cargando facturas...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : (
        <Table
          columns={columns}
          data={filteredInvoices}
          emptyMessage="No hay facturas registradas."
          rowKey={(invoice) => invoice.id}
        />
      )}

      <Modal
        description="Completa datos mínimos para registrar nueva factura en microservicio de billing."
        open={isCreateModalOpen}
        title="Crear factura"
        onClose={closeCreateModal}
      >
        <InvoiceForm onSuccess={closeCreateModal} />
      </Modal>

      <Modal
        description="Vista rápida de metadatos principales de factura."
        open={Boolean(selectedInvoice)}
        title={selectedInvoice ? `Factura ${selectedInvoice.number}` : 'Detalle de factura'}
        onClose={() => setSelectedInvoice(null)}
      >
        {selectedInvoice ? (
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-slate-500">Cliente</dt>
              <dd className="mt-1 text-sm text-slate-900">{selectedInvoice.clientName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Estado</dt>
              <dd className="mt-1 text-sm text-slate-900">{statusLabels[selectedInvoice.status]}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Total</dt>
              <dd className="mt-1 text-sm text-slate-900">
                {formatCurrency(selectedInvoice.total)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Creada</dt>
              <dd className="mt-1 text-sm text-slate-900">
                {formatDate(selectedInvoice.createdAt)}
              </dd>
            </div>
          </dl>
        ) : null}
      </Modal>
    </section>
  );
};
