import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import {
  createPaymentMethod,
  deletePaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
} from '@/features/catalog/services/catalogService';
import type {
  MethodPaymentRequest,
  MethodPaymentResponse,
} from '@/features/catalog/types/catalog.types';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';

export const usePaymentMethods = () =>
  useQuery<MethodPaymentResponse[], AxiosError>({
    queryKey: ['payment-methods'],
    queryFn: getPaymentMethods,
  });

export const useCreatePaymentMethod = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<MethodPaymentResponse, AxiosError, MethodPaymentRequest>({
    mutationFn: createPaymentMethod,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<
    MethodPaymentResponse,
    AxiosError,
    { id: number; payload: MethodPaymentRequest }
  >({
    mutationFn: ({ id, payload }) => updatePaymentMethod(id, payload),
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<void, AxiosError, number>({
    mutationFn: deletePaymentMethod,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};
