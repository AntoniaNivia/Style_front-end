import { apiClient } from '@/lib/api';
import {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from '@/lib/types';

export const authService = {
  // Register user
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data!;
  },

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data!;
  },

  // Get current user
  async getMe(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<{ user: User }>>('/users/me');
      return response.data.data!.user;
    } catch (error: any) {
      // Provide more detailed error information
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Backend server is not running');
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('Network connection failed');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication token is invalid');
      } else if (error.response?.status === 404) {
        throw new Error('User endpoint not found');
      } else {
        throw new Error(error.message || 'Failed to fetch user data');
      }
    }
  },

  // Logout (client-side only)
  logout(): void {
    if (typeof window !== 'undefined') {
      // Remove token from cookies
      document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      // Redirect to login
      window.location.href = '/login';
    }
  },
};
