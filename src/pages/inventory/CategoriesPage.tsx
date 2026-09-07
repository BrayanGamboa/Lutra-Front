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
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/features/inventory/hooks/useCategories';
import type { CategoryResponse } from '@/features/inventory/types/inventory.types';

const categorySchema = z.object({
  name: z.string().trim().min(1, 'Nombre requerido.'),
  description: z.string().trim().min(1, 'Descripción requerida.'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const CategoryForm = ({
  defaultValues,
  isPending,
  submitError,
  onSubmit,
  onCancel,
}: {
  defaultValues?: CategoryFormValues;
  isPending: boolean;
  submitError: string | null;
  onSubmit: (values: CategoryFormValues) => void;
  onCancel: () => void;
}): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input
        error={errors.name?.message}
        label="Nombre"
        placeholder="Electrónica"
        {...register('name')}
      />
      <Input
        error={errors.description?.message}
        label="Descripción"
        placeholder="Dispositivos electrónicos y accesorios"
        {...register('description')}
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

export const CategoriesPage = (): JSX.Element => {
  const { data = [], isLoading, error } = useCategories();
  const { mutate: createCategory, isPending: isCreating, error: createError } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating, error: updateError } = useUpdateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      data.filter((c) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
        );
      }),
    [data, search],
  );

  const handleCreate = (values: CategoryFormValues): void => {
    createCategory(values, { onSuccess: () => setIsCreateModalOpen(false) });
  };

  const handleUpdate = (values: CategoryFormValues): void => {
    if (!editingCategory) return;
    updateCategory(
      { id: editingCategory.categoryId, payload: values },
      { onSuccess: () => setEditingCategory(null) },
    );
  };

  const columns = useMemo<TableColumn<CategoryResponse>[]>(
    () => [
      { id: 'name', header: 'Nombre', cell: (c) => c.name },
      { id: 'description', header: 'Descripción', cell: (c) => c.description },
      {
        id: 'actions',
        header: '',
        cell: (c) => (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setEditingCategory(c)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="danger" onClick={() => deleteCategory(c.categoryId)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    [deleteCategory],
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Inventario</p>
          <h1 className="text-2xl font-semibold text-slate-900">Categorías</h1>
          <p className="max-w-2xl text-sm text-slate-500">
            Organiza los productos por categorías.
          </p>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)} tooltip='Agregar categoría'>
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
            placeholder="Buscar por nombre o descripción..."
            filteredCount={filtered.length}
            totalCount={data.length}
          />
          <Table
            columns={columns}
            data={filtered}
            emptyMessage="No hay categorías registradas."
            rowKey={(c) => c.categoryId}
          />
        </div>
      )}

      <Modal
        open={isCreateModalOpen}
        title="Nueva Categoría"
        onClose={() => setIsCreateModalOpen(false)}
      >
        <CategoryForm
          isPending={isCreating}
          submitError={createError}
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        open={editingCategory !== null}
        title="Editar Categoría"
        onClose={() => setEditingCategory(null)}
      >
        <CategoryForm
          defaultValues={
            editingCategory
              ? { name: editingCategory.name, description: editingCategory.description }
              : undefined
          }
          isPending={isUpdating}
          submitError={updateError}
          onSubmit={handleUpdate}
          onCancel={() => setEditingCategory(null)}
        />
      </Modal>
    </section>
  );
};
