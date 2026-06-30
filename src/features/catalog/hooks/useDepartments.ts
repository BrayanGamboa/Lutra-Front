import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  getDepartmentsByCountry,
  updateDepartment,
} from '@/features/catalog/services/catalogService';
import type {
  DepartmentRequest,
  DepartmentResponse,
} from '@/features/catalog/types/catalog.types';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';

export const useDepartments = () =>
  useQuery<DepartmentResponse[], AxiosError>({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });

export const useDepartmentsByCountry = (countryId: number | null) =>
  useQuery<DepartmentResponse[], AxiosError>({
    queryKey: ['departments', 'by-country', countryId],
    queryFn: () => getDepartmentsByCountry(countryId!),
    enabled: countryId !== null,
  });

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<DepartmentResponse, AxiosError, DepartmentRequest>({
    mutationFn: createDepartment,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<
    DepartmentResponse,
    AxiosError,
    { id: number; payload: DepartmentRequest }
  >({
    mutationFn: ({ id, payload }) => updateDepartment(id, payload),
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<void, AxiosError, number>({
    mutationFn: deleteDepartment,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};
