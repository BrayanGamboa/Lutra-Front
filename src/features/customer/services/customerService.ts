import { axiosClient } from '@/shared/lib/axiosClient';
import type {
  CustomerDetailsInfoRequest,
  CustomerDetailsInfoResponse,
} from '@/features/customer/types/customer.types';

export const getCustomerDetails = async (
  userId: string,
): Promise<CustomerDetailsInfoResponse> => {
  const response = await axiosClient.get<CustomerDetailsInfoResponse>(
    `customers/${userId}/details`,
  );
  return response.data;
};

export const updateCustomerDetails = async (
  payload: CustomerDetailsInfoRequest,
): Promise<CustomerDetailsInfoResponse> => {
  const response = await axiosClient.put<CustomerDetailsInfoResponse>(
    'customers/details',
    payload,
  );
  return response.data;
};
