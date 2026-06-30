import { axiosClient } from '@/shared/lib/axiosClient';
import type {
  SaleDetailRequest,
  SaleDetailResponse,
  SaleRequest,
  SaleResponse,
  SaleStatusPatchRequest,
} from '@/features/sales/types/sales.types';

export const getSales = async (): Promise<SaleResponse[]> => {
  const response = await axiosClient.get<SaleResponse[]>('sales');
  return response.data;
};

export const getSaleById = async (id: string): Promise<SaleResponse> => {
  const response = await axiosClient.get<SaleResponse>(`sales/${id}`);
  return response.data;
};

export const getSalesByCustomer = async (
  customerId: string,
): Promise<SaleResponse[]> => {
  const response = await axiosClient.get<SaleResponse[]>(
    `sales/by-customer/${customerId}`,
  );
  return response.data;
};

export const createSale = async (payload: SaleRequest): Promise<SaleResponse> => {
  const response = await axiosClient.post<SaleResponse>('sales', payload);
  return response.data;
};

export const updateSaleStatus = async (
  id: string,
  payload: SaleStatusPatchRequest,
): Promise<SaleResponse> => {
  const response = await axiosClient.patch<SaleResponse>(`sales/${id}/status`, payload);
  return response.data;
};

export const getSaleDetails = async (
  saleId: string,
): Promise<SaleDetailResponse[]> => {
  const response = await axiosClient.get<SaleDetailResponse[]>(
    `sales/${saleId}/details`,
  );
  return response.data;
};

export const getSaleDetailById = async (
  id: number,
): Promise<SaleDetailResponse> => {
  const response = await axiosClient.get<SaleDetailResponse>(
    `sales/details/${id}`,
  );
  return response.data;
};

export const createSaleDetail = async (
  payload: SaleDetailRequest,
): Promise<SaleDetailResponse> => {
  const response = await axiosClient.post<SaleDetailResponse>(
    'sales/details',
    payload,
  );
  return response.data;
};

export const deleteSaleDetail = async (id: number): Promise<void> => {
  await axiosClient.delete(`sales/details/${id}`);
};
