export interface ApiResult<T> {
  succeeded: boolean;
  data: T | null;
  errors: string[];
}

export interface PaginatedList<T> {
  items: T[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface AuthResult {
  token: string;
  refreshToken: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface TimelineEntry {
  event: string;
  timestamp: string;
  detail: string | null;
}
