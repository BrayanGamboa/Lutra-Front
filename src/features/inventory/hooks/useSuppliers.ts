import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from '@/features/inventory/services/inventoryService';
import type {
  SupplierRequest,
  SupplierResponse,
} from '@/features/inventory/types/inventory.types';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';

export const useSuppliers = () =>
  useQuery<SupplierResponse[], AxiosError>({
    queryKey: ['suppliers'],
    queryFn: getSuppliers,
  });

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<SupplierResponse, AxiosError, SupplierRequest>({
    mutationFn: createSupplier,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<
    SupplierResponse,
    AxiosError,
    { id: number; payload: SupplierRequest }
  >({
    mutationFn: ({ id, payload }) => updateSupplier(id, payload),
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<void, AxiosError, number>({
    mutationFn: deleteSupplier,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};
