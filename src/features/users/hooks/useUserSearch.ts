import { useQuery } from '@tanstack/react-query';

import { useDebounce } from '@/shared/hooks/useDebounce';
import { searchUsers } from '@/features/users/services/userService';
import type { UserListItem } from '@/features/users/types/user.types';

interface UseUserSearchParams {
  search?: string;
  rol?: string;
}

interface UseUserSearchResult {
  users: UserListItem[];
  isLoading: boolean;
}

export const useUserSearch = ({
  search = '',
  rol,
}: UseUserSearchParams): UseUserSearchResult => {
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['users', 'search', debouncedSearch, rol] as const,
    queryFn: () => searchUsers({ search: debouncedSearch, rol, page: 1, pageSize: 50 }),
  });

  return {
    users: data?.data ?? [],
    isLoading,
  };
};
