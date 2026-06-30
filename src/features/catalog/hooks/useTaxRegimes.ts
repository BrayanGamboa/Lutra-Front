import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import {
  createTaxRegime,
  deleteTaxRegime,
  getTaxRegimes,
  updateTaxRegime,
} from '@/features/catalog/services/catalogService';
import type {
  TaxRegimeRequest,
  TaxRegimeResponse,
} from '@/features/catalog/types/catalog.types';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';

export const useTaxRegimes = () =>
  useQuery<TaxRegimeResponse[], AxiosError>({
    queryKey: ['tax-regimes'],
    queryFn: getTaxRegimes,
  });

export const useCreateTaxRegime = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<TaxRegimeResponse, AxiosError, TaxRegimeRequest>({
    mutationFn: createTaxRegime,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tax-regimes'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useUpdateTaxRegime = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<
    TaxRegimeResponse,
    AxiosError,
    { id: number; payload: TaxRegimeRequest }
  >({
    mutationFn: ({ id, payload }) => updateTaxRegime(id, payload),
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tax-regimes'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useDeleteTaxRegime = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<void, AxiosError, number>({
    mutationFn: deleteTaxRegime,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tax-regimes'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};
