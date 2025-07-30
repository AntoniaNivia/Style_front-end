import type { User } from '@/lib/types';

// This is a mock hook for demonstration purposes.
// In a real application, this would be replaced with a proper authentication context.
export const useUser = (): { user: User | null; isLoading: boolean } => {
  const user: User = {
    id: '1',
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    type: 'user', // Can be 'user' or 'store' to test different views
    gender: 'female',
    mannequin: 'Woman',
    style: 'Casual Chic',
    avatarUrl: 'https://placehold.co/100x100'
  };

  return { user, isLoading: false };
};

export const useStore = (): { user: User | null; isLoading: boolean } => {
    const user: User = {
      id: 'store-1',
      name: 'Lila Boutique',
      email: 'contact@lilaboutique.com',
      type: 'store',
      gender: 'other',
      mannequin: 'Neutral',
      style: 'Modern & Elegant',
      avatarUrl: 'https://placehold.co/100x100'
    };
  
    return { user, isLoading: false };
  }
