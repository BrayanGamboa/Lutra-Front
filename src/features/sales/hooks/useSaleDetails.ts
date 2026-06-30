import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import {
  createSaleDetail,
  deleteSaleDetail,
  getSaleDetails,
} from '@/features/sales/services/salesService';
import type {
  SaleDetailRequest,
  SaleDetailResponse,
} from '@/features/sales/types/sales.types';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';

export const useSaleDetails = (saleId: string | null) =>
  useQuery<SaleDetailResponse[], AxiosError>({
    queryKey: ['sale-details', saleId],
    queryFn: () => getSaleDetails(saleId!),
    enabled: saleId !== null && saleId !== '',
  });

export const useCreateSaleDetail = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<SaleDetailResponse, AxiosError, SaleDetailRequest>({
    mutationFn: createSaleDetail,
    onMutate: () => { setError(null); },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['sale-details', data.saleId] });
      await queryClient.invalidateQueries({ queryKey: ['sales'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useDeleteSaleDetail = (saleId: string) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<void, AxiosError, number>({
    mutationFn: deleteSaleDetail,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['sale-details', saleId] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};
