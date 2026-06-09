import { axiosClient } from '@/shared/lib/axiosClient';
import type {
  CreateInvoicePayload,
  Invoice,
} from '@/features/billing/types/billing.types';

export const getInvoices = async (): Promise<Invoice[]> => {
  const response = await axiosClient.get<Invoice[]>('/billing/invoices');

  return response.data;
};

export const createInvoice = async (
  payload: CreateInvoicePayload,
): Promise<Invoice> => {
  const response = await axiosClient.post<Invoice>('/billing/invoices', payload);

  return response.data;
};
