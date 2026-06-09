import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { createInvoice } from '@/features/billing/services/billingService';
import type {
  CreateInvoicePayload,
  Invoice,
} from '@/features/billing/types/billing.types';

interface ApiError {
  message?: string;
}

const getErrorMessage = (error: AxiosError<ApiError>): string =>
  error.response?.data?.message ?? error.message ?? 'No fue posible crear factura.';

export const useCreateInvoice = (): {
  createInvoice: (payload: CreateInvoicePayload, onSuccess?: () => void) => void;
  isPending: boolean;
  error: string | null;
} => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<Invoice, AxiosError<ApiError>, CreateInvoicePayload>({
    mutationFn: createInvoice,
    onMutate: () => {
      setError(null);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (mutationError) => {
      setError(getErrorMessage(mutationError));
    },
  });

  return {
    createInvoice: (payload, onSuccess) => {
      mutation.mutate(payload, {
        onSuccess: () => {
          onSuccess?.();
        },
      });
    },
    isPending: mutation.isPending,
    error,
  };
};
