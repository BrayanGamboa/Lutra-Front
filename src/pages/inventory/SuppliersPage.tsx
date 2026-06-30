import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { OtterMascot } from '@/components/OtterMascot';
import { SearchBar } from '@/components/SearchBar';
import { Table, type TableColumn } from '@/components/Table';
import {
  useCreateSupplier,
  useDeleteSupplier,
  useSuppliers,
  useUpdateSupplier,
} from '@/features/inventory/hooks/useSuppliers';
import type { SupplierResponse } from '@/features/inventory/types/inventory.types';

const supplierSchema = z.object({
  name: z.string().trim().min(1, 'Nombre requerido.'),
  contactName: z.string().trim().min(1, 'Contacto requerido.'),
  email: z.string().trim().email('Correo inválido.'),
  phone: z.string().trim().min(1, 'Teléfono requerido.'),
  address: z.string().trim().min(1, 'Dirección requerida.'),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

const SupplierForm = ({
  defaultValues,
  isPending,
  submitError,
  onSubmit,
  onCancel,
}: {
  defaultValues?: SupplierFormValues;
  isPending: boolean;
  submitError: string | null;
  onSubmit: (values: SupplierFormValues) => void;
  onCancel: () => void;
}): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues,
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          error={errors.name?.message}
          label="Nombre empresa"
          placeholder="Proveedor S.A."
          {...register('name')}
        />
        <Input
          error={errors.contactName?.message}
          label="Contacto"
          placeholder="Juan Pérez"
          {...register('contactName')}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          error={errors.email?.message}
          label="Correo"
          placeholder="contacto@proveedor.com"
          type="email"
          {...register('email')}
        />
        <Input
          error={errors.phone?.message}
          label="Teléfono"
          placeholder="+57 300 000 0000"
          {...register('phone')}
        />
      </div>
      <Input
        error={errors.address?.message}
        label="Dirección"
        placeholder="Cra. 1 #2-3"
        {...register('address')}
      />

      {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button isLoading={isPending} type="submit">
          Guardar
        </Button>
      </div>
    </form>
  );
};

export const SuppliersPage = (): JSX.Element => {
  const { data = [], isLoading, error } = useSuppliers();
  const { mutate: createSupplier, isPending: isCreating, error: createError } = useCreateSupplier();
  const { mutate: updateSupplier, isPending: isUpdating, error: updateError } = useUpdateSupplier();
  const { mutate: deleteSupplier } = useDeleteSupplier();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierResponse | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      data.filter((s) => {
        if (!search.trim()) return true;
        return s.name.toLowerCase().includes(search.toLowerCase());
      }),
    [data, search],
  );

  const handleCreate = (values: SupplierFormValues): void => {
    createSupplier(values, { onSuccess: () => setIsCreateModalOpen(false) });
  };

  const handleUpdate = (values: SupplierFormValues): void => {
    if (!editingSupplier) return;
    updateSupplier(
      { id: editingSupplier.supplierId, payload: values },
      { onSuccess: () => setEditingSupplier(null) },
    );
  };

  const columns = useMemo<TableColumn<SupplierResponse>[]>(
    () => [
      { id: 'name', header: 'Empresa', cell: (s) => s.name },
      { id: 'contactName', header: 'Contacto', cell: (s) => s.contactName },
      { id: 'email', header: 'Correo', cell: (s) => s.email },
      { id: 'phone', header: 'Teléfono', cell: (s) => s.phone },
      {
        id: 'actions',
        header: '',
        cell: (s) => (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setEditingSupplier(s)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="danger" onClick={() => deleteSupplier(s.supplierId)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    [deleteSupplier],
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Inventario</p>
          <h1 className="text-2xl font-semibold text-slate-900">Proveedores</h1>
          <p className="max-w-2xl text-sm text-slate-500">
            Gestiona los proveedores del sistema.
          </p>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Nuevo Proveedor
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
            placeholder="Buscar por nombre..."
            filteredCount={filtered.length}
            totalCount={data.length}
          />
          <Table
            columns={columns}
            data={filtered}
            emptyMessage="No hay proveedores registrados."
            rowKey={(s) => s.supplierId}
          />
        </div>
      )}

      <Modal
        open={isCreateModalOpen}
        title="Nuevo Proveedor"
        onClose={() => setIsCreateModalOpen(false)}
      >
        <SupplierForm
          isPending={isCreating}
          submitError={createError}
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        open={editingSupplier !== null}
        title="Editar Proveedor"
        onClose={() => setEditingSupplier(null)}
      >
        <SupplierForm
          defaultValues={
            editingSupplier
              ? {
                  name: editingSupplier.name,
                  contactName: editingSupplier.contactName,
                  email: editingSupplier.email,
                  phone: editingSupplier.phone,
                  address: editingSupplier.address,
                }
              : undefined
          }
          isPending={isUpdating}
          submitError={updateError}
          onSubmit={handleUpdate}
          onCancel={() => setEditingSupplier(null)}
        />
      </Modal>
    </section>
  );
};
