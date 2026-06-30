export interface UserListItem {
  userId: string;
  username: string;
  email: string;
  name: string;
  lastName: string;
  isActive: boolean;
  roles: string[];
}

export interface UserListResponse {
  data: UserListItem[];
  total: number;
  page: number;
  pageSize: number;
}
