import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { OtterMascot } from '@/components/OtterMascot';
import { SearchBar } from '@/components/SearchBar';
import { SearchableSelect } from '@/components/SearchableSelect';
import { Table, type TableColumn } from '@/components/Table';
import { useCategories } from '@/features/inventory/hooks/useCategories';
import { useSuppliers } from '@/features/inventory/hooks/useSuppliers';
import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from '@/features/products/hooks/useProducts';
import type { ProductResponse } from '@/features/products/types/products.types';
import { formatCurrency } from '@/shared/utils/formatCurrency';

const productSchema = z.object({
  name: z.string().trim().min(1, 'Nombre requerido.'),
  description: z.string().trim().min(1, 'Descripción requerida.'),
  sku: z.string().trim().min(1, 'SKU requerido.'),
  price: z.coerce.number().positive('El precio debe ser mayor a 0.'),
  cost: z.coerce.number().nonnegative().optional(),
  supplierId: z.number().int().positive().optional(),
  categoryId: z.number().int().positive().optional(),
  isActive: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductForm = ({
  defaultValues,
  isPending,
  submitError,
  onSubmit,
  onCancel,
}: {
  defaultValues?: Partial<ProductFormValues>;
  isPending: boolean;
  submitError: string | null;
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
}): JSX.Element => {
  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const { data: suppliers = [], isLoading: loadingSuppliers } = useSuppliers();

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: c.categoryId, label: c.name })),
    [categories],
  );
  const supplierOptions = useMemo(
    () => suppliers.map((s) => ({ value: s.supplierId, label: s.name ?? '' })),
    [suppliers],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { isActive: true, ...defaultValues },
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          error={errors.name?.message}
          label="Nombre"
          placeholder="Producto XYZ"
          {...register('name')}
        />
        <Input
          error={errors.sku?.message}
          label="SKU"
          placeholder="SKU-001"
          {...register('sku')}
        />
      </div>
      <Input
        error={errors.description?.message}
        label="Descripción"
        placeholder="Descripción del producto"
        {...register('description')}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          error={errors.price?.message}
          label="Precio"
          placeholder="0.00"
          type="number"
          step="0.01"
          {...register('price')}
        />
        <Input
          error={errors.cost?.message}
          label="Costo (opcional)"
          placeholder="0.00"
          type="number"
          step="0.01"
          {...register('cost')}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <SearchableSelect
              label="Categoría (opcional)"
              options={categoryOptions}
              value={field.value ?? null}
              onChange={(v) => field.onChange(v === null ? undefined : Number(v))}
              error={errors.categoryId?.message}
              isLoading={loadingCategories}
              clearable
            />
          )}
        />
        <Controller
          control={control}
          name="supplierId"
          render={({ field }) => (
            <SearchableSelect
              label="Proveedor (opcional)"
              options={supplierOptions}
              value={field.value ?? null}
              onChange={(v) => field.onChange(v === null ? undefined : Number(v))}
              error={errors.supplierId?.message}
              isLoading={loadingSuppliers}
              clearable
            />
          )}
        />
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" {...register('isActive')} className="rounded border-slate-300" />
        Activo
      </label>

      {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" tooltip='Cancelar' onClick={onCancel}>
          Cancelar
        </Button>
        <Button isLoading={isPending} type="submit" tooltip='Guardar'>
          Guardar
        </Button>
      </div>
    </form>
  );
};

export const ProductsPage = (): JSX.Element => {
  const { data = [], isLoading, error } = useProducts();
  const { mutate: createProduct, isPending: isCreating, error: createError } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating, error: updateError } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      data.filter((p) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
        );
      }),
    [data, search],
  );

  const handleCreate = (values: ProductFormValues): void => {
    createProduct(values, {
      onSuccess: () => setIsCreateModalOpen(false),
    });
  };

  const handleUpdate = (values: ProductFormValues): void => {
    if (!editingProduct) return;
    updateProduct(
      { id: editingProduct.productId, payload: values },
      { onSuccess: () => setEditingProduct(null) },
    );
  };

  const columns = useMemo<TableColumn<ProductResponse>[]>(
    () => [
      { id: 'name', header: 'Nombre', cell: (p) => p.name },
      {
        id: 'sku',
        header: 'SKU',
        cell: (p) => <span className="font-mono text-xs">{p.sku}</span>,
      },
      { id: 'price', header: 'Precio', cell: (p) => formatCurrency(p.price) },
      { id: 'categoryId', header: 'Categoría ID', cell: (p) => p.categoryId ?? '—' },
      {
        id: 'isActive',
        header: 'Activo',
        cell: (p) => (
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
              p.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {p.isActive ? 'Sí' : 'No'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: (p) => (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" tooltip={`Editar ${p.name}`} onClick={() => setEditingProduct(p)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="danger" tooltip={`Eliminar ${p.name}`} onClick={() => deleteProduct(p.productId)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    [deleteProduct],
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Inventario</p>
          <h1 className="text-2xl font-semibold text-slate-900">Productos</h1>
          <p className="max-w-2xl text-sm text-slate-500">
            Administra el catálogo de productos del sistema.
          </p>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)} tooltip='Agregar producto'>
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
            placeholder="Buscar por nombre o SKU..."
            filteredCount={filtered.length}
            totalCount={data.length}
          />
          <Table
            columns={columns}
            data={filtered}
            emptyMessage="No hay productos registrados."
            rowKey={(p) => p.productId}
          />
        </div>
      )}

      <Modal
        open={isCreateModalOpen}
        title="Nuevo Producto"
        onClose={() => setIsCreateModalOpen(false)}
      >
        <ProductForm
          isPending={isCreating}
          submitError={createError}
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        open={editingProduct !== null}
        title="Editar Producto"
        onClose={() => setEditingProduct(null)}
      >
        <ProductForm
          defaultValues={
            editingProduct
              ? {
                  name: editingProduct.name,
                  description: editingProduct.description,
                  sku: editingProduct.sku,
                  price: editingProduct.price,
                  cost: editingProduct.cost,
                  supplierId: editingProduct.supplierId,
                  categoryId: editingProduct.categoryId,
                  isActive: editingProduct.isActive,
                }
              : undefined
          }
          isPending={isUpdating}
          submitError={updateError}
          onSubmit={handleUpdate}
          onCancel={() => setEditingProduct(null)}
        />
      </Modal>
    </section>
  );
};
