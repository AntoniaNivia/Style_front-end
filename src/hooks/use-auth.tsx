'use client';

'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { User, AuthResponse, LoginCredentials, RegisterData } from '@/lib/types';
import { authService } from '@/lib/services/auth.service';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isAuthenticated = !!user;

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = Cookies.get('auth_token');
        if (token) {
          console.log('🔍 Loading user data...');
          const userData = await authService.getMe();
          setUser(userData);
          console.log('✅ User loaded successfully:', userData.name);
        } else {
          console.log('ℹ️ No auth token found');
        }
      } catch (error: any) {
        console.warn('⚠️ Failed to load user data:', error.message);
        
        // If it's a network error (backend offline), keep token but don't set user
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || !error.response) {
          console.log('🌐 Backend appears to be offline - keeping token for when it comes back');
          // Don't remove token, just log the issue
        } else {
          // Token is invalid, remove it
          console.log('🗑️ Removing invalid token');
          Cookies.remove('auth_token');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const { user: userData, token } = await authService.login(credentials);
      
      // Store token in cookies (secure, httpOnly in production)
      Cookies.set('auth_token', token, { 
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      setUser(userData);
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a), ${userData.name}!`,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao fazer login';
      toast({
        title: "Erro no login",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const { user: userData, token } = await authService.register(data);
      
      // Store token in cookies
      Cookies.set('auth_token', token, { 
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      setUser(userData);
      
      toast({
        title: "Conta criada com sucesso!",
        description: `Bem-vindo(a) ao Style, ${userData.name}!`,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao criar conta';
      toast({
        title: "Erro no registro",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('auth_token');
    setUser(null);
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (error) {
      // If refresh fails, logout
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
