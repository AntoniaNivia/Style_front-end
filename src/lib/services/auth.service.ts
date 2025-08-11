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
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/register', data);
    return response.data.data!;
  },

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/login', credentials);
      if (!response.data || !response.data.data) {
        throw new Error('Não foi possível realizar o login. A resposta da API está vazia ou inválida.');
      }
      return response.data.data;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Backend server is not running');
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('Network connection failed');
      } else if (error.response?.status === 401) {
        throw new Error('Credenciais inválidas ou token inválido');
      } else if (error.response?.status === 404) {
        throw new Error('Endpoint de login não encontrado');
      } else if (error.message?.includes('API está vazia') || error.message?.includes('Failed to fetch user data')) {
        throw new Error('Erro ao realizar login: resposta da API inválida ou vazia.');
      } else {
        throw new Error(error.message || 'Failed to login');
      }
    }
  },

  // Get current user
  async getMe(): Promise<User> {
    try {
  const response = await apiClient.get<ApiResponse<{ user: User }>>('/api/users/me');
      // Verifica se a resposta tem dados válidos
      if (!response.data || !response.data.data || !response.data.data.user) {
        throw new Error('Não foi possível obter os dados do usuário. A resposta da API está vazia ou inválida.');
      }
      return response.data.data.user;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Backend server is not running');
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('Network connection failed');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication token is invalid');
      } else if (error.response?.status === 404) {
        throw new Error('User endpoint not found');
      } else if (error.message?.includes('API está vazia') || error.message?.includes('Failed to fetch user data')) {
        throw new Error('Erro ao buscar usuário: resposta da API inválida ou vazia.');
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
