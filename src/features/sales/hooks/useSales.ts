import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import {
  createSale,
  getSales,
  getSalesByCustomer,
  updateSaleStatus,
} from '@/features/sales/services/salesService';
import type {
  SaleRequest,
  SaleResponse,
  SaleStatusPatchRequest,
} from '@/features/sales/types/sales.types';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';

export const useSales = () =>
  useQuery<SaleResponse[], AxiosError>({
    queryKey: ['sales'],
    queryFn: getSales,
  });

export const useSalesByCustomer = (customerId: string | null) =>
  useQuery<SaleResponse[], AxiosError>({
    queryKey: ['sales', 'by-customer', customerId],
    queryFn: () => getSalesByCustomer(customerId!),
    enabled: customerId !== null && customerId !== '',
  });

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<SaleResponse, AxiosError, SaleRequest>({
    mutationFn: createSale,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['sales'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useUpdateSaleStatus = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<
    SaleResponse,
    AxiosError,
    { id: string; payload: SaleStatusPatchRequest }
  >({
    mutationFn: ({ id, payload }) => updateSaleStatus(id, payload),
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['sales'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};
