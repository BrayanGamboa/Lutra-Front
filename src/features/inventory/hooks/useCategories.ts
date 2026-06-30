import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '@/features/inventory/services/inventoryService';
import type {
  CategoryRequest,
  CategoryResponse,
} from '@/features/inventory/types/inventory.types';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';

export const useCategories = () =>
  useQuery<CategoryResponse[], AxiosError>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<CategoryResponse, AxiosError, CategoryRequest>({
    mutationFn: createCategory,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<
    CategoryResponse,
    AxiosError,
    { id: number; payload: CategoryRequest }
  >({
    mutationFn: ({ id, payload }) => updateCategory(id, payload),
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<void, AxiosError, number>({
    mutationFn: deleteCategory,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};
