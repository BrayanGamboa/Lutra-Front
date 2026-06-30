import { axiosClient } from '@/shared/lib/axiosClient';
import type { UserListResponse } from '@/features/users/types/user.types';

export interface UserSearchParams {
  search?: string;
  rol?: string;
  page?: number;
  pageSize?: number;
}

export const searchUsers = (params: UserSearchParams): Promise<UserListResponse> =>
  axiosClient
    .get<UserListResponse>('usuarios', { params })
    .then((r) => r.data);
