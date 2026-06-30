import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductsByCategory,
  getProductsBySupplier,
  updateProduct,
} from '@/features/products/services/productsService';
import type {
  ProductRequest,
  ProductResponse,
} from '@/features/products/types/products.types';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';

export const useProducts = () =>
  useQuery<ProductResponse[], AxiosError>({
    queryKey: ['products'],
    queryFn: getProducts,
  });

export const useProductsByCategory = (categoryId: number | null) =>
  useQuery<ProductResponse[], AxiosError>({
    queryKey: ['products', 'by-category', categoryId],
    queryFn: () => getProductsByCategory(categoryId!),
    enabled: categoryId !== null,
  });

export const useProductsBySupplier = (supplierId: number | null) =>
  useQuery<ProductResponse[], AxiosError>({
    queryKey: ['products', 'by-supplier', supplierId],
    queryFn: () => getProductsBySupplier(supplierId!),
    enabled: supplierId !== null,
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<ProductResponse, AxiosError, ProductRequest>({
    mutationFn: createProduct,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<
    ProductResponse,
    AxiosError,
    { id: number; payload: ProductRequest }
  >({
    mutationFn: ({ id, payload }) => updateProduct(id, payload),
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<void, AxiosError, number>({
    mutationFn: deleteProduct,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};
