import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import {
  getCustomerDetails,
  updateCustomerDetails,
} from '@/features/customer/services/customerService';
import type {
  CustomerDetailsInfoRequest,
  CustomerDetailsInfoResponse,
} from '@/features/customer/types/customer.types';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';

export const useCustomerDetails = (userId: string | null) =>
  useQuery<CustomerDetailsInfoResponse, AxiosError>({
    queryKey: ['customer-details', userId],
    queryFn: () => getCustomerDetails(userId!),
    enabled: userId !== null && userId !== '',
    retry: (failureCount, error) => {
      if (error.response?.status === 400) return false;
      return failureCount < 1;
    },
  });

export const useUpdateCustomerDetails = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<
    CustomerDetailsInfoResponse,
    AxiosError,
    CustomerDetailsInfoRequest
  >({
    mutationFn: updateCustomerDetails,
    onMutate: () => { setError(null); },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ['customer-details', data.userId],
      });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error, isSuccess: mutation.isSuccess };
};
