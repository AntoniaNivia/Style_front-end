
'use client';

import { useAuth } from './use-auth';

// This hook provides user data from the auth context
export const useUser = () => {
  const { user, isLoading, isAuthenticated, refreshUser } = useAuth();

  return {
    user,
    isLoading,
    isAuthenticated,
    refreshUser,
  };
};

