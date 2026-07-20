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
  refreshToken?: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  isVerified: boolean;
  businessName: string;
}

export interface TimelineEntry {
  event: string;
  timestamp: string;
  detail: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  businessName: string;
  dateOfBirth: string;
  phone?: string;
}

export interface RegisterResponse {
  message: string;
}

export interface VerifyEmailPayload {
  email: string;
  token: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  newPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}
