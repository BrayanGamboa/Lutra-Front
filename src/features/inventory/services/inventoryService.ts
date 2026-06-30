import { axiosClient } from '@/shared/lib/axiosClient';
import type {
  CategoryRequest,
  CategoryResponse,
  InventoryMovementRequest,
  InventoryMovementResponse,
  ReferencesTypeRequest,
  ReferencesTypeResponse,
  SupplierRequest,
  SupplierResponse,
} from '@/features/inventory/types/inventory.types';

export const getCategories = async (): Promise<CategoryResponse[]> => {
  const response = await axiosClient.get<CategoryResponse[]>('inventory/categories');
  return response.data;
};

export const createCategory = async (
  payload: CategoryRequest,
): Promise<CategoryResponse> => {
  const response = await axiosClient.post<CategoryResponse>(
    'inventory/categories',
    payload,
  );
  return response.data;
};

export const updateCategory = async (
  id: number,
  payload: CategoryRequest,
): Promise<CategoryResponse> => {
  const response = await axiosClient.put<CategoryResponse>(
    `inventory/categories/${id}`,
    payload,
  );
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axiosClient.delete(`inventory/categories/${id}`);
};

export const getSuppliers = async (): Promise<SupplierResponse[]> => {
  const response = await axiosClient.get<SupplierResponse[]>('inventory/suppliers');
  return response.data;
};

export const createSupplier = async (
  payload: SupplierRequest,
): Promise<SupplierResponse> => {
  const response = await axiosClient.post<SupplierResponse>(
    'inventory/suppliers',
    payload,
  );
  return response.data;
};

export const updateSupplier = async (
  id: number,
  payload: SupplierRequest,
): Promise<SupplierResponse> => {
  const response = await axiosClient.put<SupplierResponse>(
    `inventory/suppliers/${id}`,
    payload,
  );
  return response.data;
};

export const deleteSupplier = async (id: number): Promise<void> => {
  await axiosClient.delete(`inventory/suppliers/${id}`);
};

export const getReferenceTypes = async (): Promise<ReferencesTypeResponse[]> => {
  const response = await axiosClient.get<ReferencesTypeResponse[]>(
    'inventory/references-types',
  );
  return response.data;
};

export const createReferenceType = async (
  payload: ReferencesTypeRequest,
): Promise<ReferencesTypeResponse> => {
  const response = await axiosClient.post<ReferencesTypeResponse>(
    'inventory/references-types',
    payload,
  );
  return response.data;
};

export const updateReferenceType = async (
  id: number,
  payload: ReferencesTypeRequest,
): Promise<ReferencesTypeResponse> => {
  const response = await axiosClient.put<ReferencesTypeResponse>(
    `inventory/references-types/${id}`,
    payload,
  );
  return response.data;
};

export const deleteReferenceType = async (id: number): Promise<void> => {
  await axiosClient.delete(`inventory/references-types/${id}`);
};

export const getInventoryMovements = async (): Promise<InventoryMovementResponse[]> => {
  const response = await axiosClient.get<InventoryMovementResponse[]>('inventory/movements');
  return response.data;
};

export const getInventoryMovementById = async (
  id: number,
): Promise<InventoryMovementResponse> => {
  const response = await axiosClient.get<InventoryMovementResponse>(
    `inventory/movements/${id}`,
  );
  return response.data;
};

export const getMovementsByProduct = async (
  productId: number,
): Promise<InventoryMovementResponse[]> => {
  const response = await axiosClient.get<InventoryMovementResponse[]>(
    `inventory/movements/by-product/${productId}`,
  );
  return response.data;
};

export const createInventoryMovement = async (
  payload: InventoryMovementRequest,
): Promise<InventoryMovementResponse> => {
  const response = await axiosClient.post<InventoryMovementResponse>(
    'inventory/movements',
    payload,
  );
  return response.data;
};
