export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface AuthContextValue extends AuthState {
  login: (creds: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (data: ChangePasswordInput) => Promise<void>;
  refresh: () => Promise<void>;
  getCsrfToken: () => string | null;
}

export interface AdminLoginResponse {
  user: User;
}

export interface AdminMeResponse {
  user: User;
}

export interface PaginatedDrawsResponse {
  data: DrawSummary[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DrawSummary {
  officialNumber: number;
  date: string;
  modality: 'tradicional' | 'la_segunda' | 'revancha' | 'siempre_sale';
  numbers: number[];
}
