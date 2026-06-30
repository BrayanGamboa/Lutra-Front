import { axiosClient } from '@/shared/lib/axiosClient';
import type {
  ProductRequest,
  ProductResponse,
} from '@/features/products/types/products.types';

export const getProducts = async (): Promise<ProductResponse[]> => {
  const response = await axiosClient.get<ProductResponse[]>('products');
  return response.data;
};

export const getProductById = async (id: number): Promise<ProductResponse> => {
  const response = await axiosClient.get<ProductResponse>(`products/${id}`);
  return response.data;
};

export const getProductsByCategory = async (
  categoryId: number,
): Promise<ProductResponse[]> => {
  const response = await axiosClient.get<ProductResponse[]>(
    `products/by-category/${categoryId}`,
  );
  return response.data;
};

export const getProductsBySupplier = async (
  supplierId: number,
): Promise<ProductResponse[]> => {
  const response = await axiosClient.get<ProductResponse[]>(
    `products/by-supplier/${supplierId}`,
  );
  return response.data;
};

export const createProduct = async (
  payload: ProductRequest,
): Promise<ProductResponse> => {
  const response = await axiosClient.post<ProductResponse>('products', payload);
  return response.data;
};

export const updateProduct = async (
  id: number,
  payload: ProductRequest,
): Promise<ProductResponse> => {
  const response = await axiosClient.put<ProductResponse>(`products/${id}`, payload);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await axiosClient.delete(`products/${id}`);
};
