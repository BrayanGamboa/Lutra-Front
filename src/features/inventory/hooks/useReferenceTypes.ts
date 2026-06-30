import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import {
  createReferenceType,
  deleteReferenceType,
  getReferenceTypes,
  updateReferenceType,
} from '@/features/inventory/services/inventoryService';
import type {
  ReferencesTypeRequest,
  ReferencesTypeResponse,
} from '@/features/inventory/types/inventory.types';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';

export const useReferenceTypes = () =>
  useQuery<ReferencesTypeResponse[], AxiosError>({
    queryKey: ['reference-types'],
    queryFn: getReferenceTypes,
  });

export const useCreateReferenceType = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<ReferencesTypeResponse, AxiosError, ReferencesTypeRequest>({
    mutationFn: createReferenceType,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['reference-types'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useUpdateReferenceType = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<
    ReferencesTypeResponse,
    AxiosError,
    { id: number; payload: ReferencesTypeRequest }
  >({
    mutationFn: ({ id, payload }) => updateReferenceType(id, payload),
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['reference-types'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useDeleteReferenceType = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<void, AxiosError, number>({
    mutationFn: deleteReferenceType,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['reference-types'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};
