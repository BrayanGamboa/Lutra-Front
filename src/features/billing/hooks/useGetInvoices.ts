import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { getInvoices } from '@/features/billing/services/billingService';
import type { Invoice } from '@/features/billing/types/billing.types';

interface ApiError {
  message?: string;
}

export const useGetInvoices = () =>
  useQuery<Invoice[], AxiosError<ApiError>>({
    queryKey: ['invoices'],
    queryFn: getInvoices,
  });
