import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import {
  createCountry,
  deleteCountry,
  getCountries,
  updateCountry,
} from '@/features/catalog/services/catalogService';
import type {
  CountryRequest,
  CountryResponse,
} from '@/features/catalog/types/catalog.types';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';

export const useCountries = () =>
  useQuery<CountryResponse[], AxiosError>({
    queryKey: ['countries'],
    queryFn: getCountries,
  });

export const useCreateCountry = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<CountryResponse, AxiosError, CountryRequest>({
    mutationFn: createCountry,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['countries'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useUpdateCountry = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<
    CountryResponse,
    AxiosError,
    { id: number; payload: CountryRequest }
  >({
    mutationFn: ({ id, payload }) => updateCountry(id, payload),
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['countries'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useDeleteCountry = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<void, AxiosError, number>({
    mutationFn: deleteCountry,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['countries'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};
