import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import {
  createDocumentType,
  deleteDocumentType,
  getDocumentTypes,
  updateDocumentType,
} from '@/features/catalog/services/catalogService';
import type {
  DocumentTypeRequest,
  DocumentTypeResponse,
} from '@/features/catalog/types/catalog.types';
import { getApiErrorMessage } from '@/shared/utils/getApiErrorMessage';

export const useDocumentTypes = () =>
  useQuery<DocumentTypeResponse[], AxiosError>({
    queryKey: ['document-types'],
    queryFn: getDocumentTypes,
  });

export const useCreateDocumentType = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<DocumentTypeResponse, AxiosError, DocumentTypeRequest>({
    mutationFn: createDocumentType,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['document-types'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useUpdateDocumentType = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<
    DocumentTypeResponse,
    AxiosError,
    { id: number; payload: DocumentTypeRequest }
  >({
    mutationFn: ({ id, payload }) => updateDocumentType(id, payload),
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['document-types'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};

export const useDeleteDocumentType = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation<void, AxiosError, number>({
    mutationFn: deleteDocumentType,
    onMutate: () => { setError(null); },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['document-types'] });
    },
    onError: (err) => { setError(getApiErrorMessage(err)); },
  });

  return { mutate: mutation.mutate, isPending: mutation.isPending, error };
};
