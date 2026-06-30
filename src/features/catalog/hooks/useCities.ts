import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import {
  createCity,
  deleteCity,
  getCities,
  getCitiesByDepartment,
  updateCity,
} from '@/features/catalog/services/catalogService';
import type {
  CityRequest,
  CityResponse,
} from '@/features/catalog/types/catalog.types';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';

export const useCities = () =>
  useQuery<CityResponse[], AxiosError>({
    queryKey: ['cities'],
    queryFn: getCities,
  });

export const useCitiesByDepartment = (departmentId: number | null) =>
  useQuery<CityResponse[], AxiosError>({
    queryKey: ['cities', 'by-department', departmentId],
    queryFn: () => getCitiesByDepartment(departmentId!),
    enabled: departmentId !== null,
  });

export const useCreateCity = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<CityResponse, AxiosError, CityRequest>({
    mutationFn: createCity,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cities'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useUpdateCity = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<
    CityResponse,
    AxiosError,
    { id: number; payload: CityRequest }
  >({
    mutationFn: ({ id, payload }) => updateCity(id, payload),
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cities'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useDeleteCity = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<void, AxiosError, number>({
    mutationFn: deleteCity,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cities'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};
