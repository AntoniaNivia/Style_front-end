import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

// Mock authentication for development/testing
export const useMockAuth = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Only use mock authentication in development and when backend is not available
    if (!isAuthenticated && process.env.NODE_ENV === 'development') {
      const mockToken = 'mock-jwt-token-for-testing';
      
      // Set mock token
      Cookies.set('auth_token', mockToken, {
        expires: 1, // 1 day
        secure: false,
        sameSite: 'strict'
      });

      console.log('🔧 Mock authentication enabled for development');
      console.log('🔧 Mock token set:', mockToken);
      
      // Refresh the page to pick up the new token
      setTimeout(() => {
        if (!isAuthenticated) {
          window.location.reload();
        }
      }, 100);
    }
  }, [isAuthenticated]);

  const hasToken = !!Cookies.get('auth_token');
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    // Only use mock mode in development when there's no real authentication
    isMockMode: isDevelopment && !isAuthenticated && hasToken,
    hasValidAuth: isAuthenticated || hasToken,
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment
  };
};
