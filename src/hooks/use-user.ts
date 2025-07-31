
import type { User } from '@/lib/types';
import { useEffect, useState } from 'react';

// This hook will fetch user data from the backend API.
// For now, it returns mock data until the backend is connected.
export const useUser = (): { user: User | null; isLoading: boolean } => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch the user from an API endpoint like '/api/users/me'
    // For demonstration, we'll keep a mock user.
    // Replace this with your actual API call.
    const mockUser: User = {
      id: 'store-1',
      name: 'Lila Boutique',
      email: 'contact@lilaboutique.com',
      type: 'store', // Can be 'user' or 'store'
      gender: 'other',
      mannequin: 'Neutral',
      style: 'Moderno & Elegante',
      avatarUrl: 'https://placehold.co/100x100'
    };
    setUser(mockUser);
    setIsLoading(false);
  }, []);

  return { user, isLoading };
};
