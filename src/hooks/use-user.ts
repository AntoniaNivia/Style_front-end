import type { User } from '@/lib/types';

// This is a mock hook for demonstration purposes.
// In a real application, this would be replaced with a proper authentication context.
export const useUser = (): { user: User | null; isLoading: boolean } => {
  const user: User = {
    id: 'store-1', // Changed to 'store-1' to simulate a store user
    name: 'Lila Boutique',
    email: 'contact@lilaboutique.com',
    type: 'store', // Can be 'user' or 'store' to test different views
    gender: 'other',
    mannequin: 'Neutral',
    style: 'Moderno & Elegante',
    avatarUrl: 'https://placehold.co/100x100'
  };

  return { user, isLoading: false };
};

export const useRegularUser = (): { user: User | null; isLoading: boolean } => {
    const user: User = {
      id: '1',
      name: 'Alex Doe',
      email: 'alex.doe@example.com',
      type: 'user',
      gender: 'female',
      mannequin: 'Woman',
      style: 'Chique Casual',
      avatarUrl: 'https://placehold.co/100x100'
    };
  
    return { user, isLoading: false };
  }
