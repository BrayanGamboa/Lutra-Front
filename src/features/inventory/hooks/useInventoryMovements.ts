import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import {
  createInventoryMovement,
  getInventoryMovements,
  getMovementsByProduct,
} from '@/features/inventory/services/inventoryService';
import type {
  InventoryMovementRequest,
  InventoryMovementResponse,
} from '@/features/inventory/types/inventory.types';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';

export const useInventoryMovements = () =>
  useQuery<InventoryMovementResponse[], AxiosError>({
    queryKey: ['inventory-movements'],
    queryFn: getInventoryMovements,
  });

export const useMovementsByProduct = (productId: number | null) =>
  useQuery<InventoryMovementResponse[], AxiosError>({
    queryKey: ['inventory-movements', 'by-product', productId],
    queryFn: () => getMovementsByProduct(productId!),
    enabled: productId !== null,
  });

export const useCreateInventoryMovement = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<
    InventoryMovementResponse,
    AxiosError,
    InventoryMovementRequest
  >({
    mutationFn: createInventoryMovement,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['inventory-movements'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};
