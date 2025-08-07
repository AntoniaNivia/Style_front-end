
// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginationResult<T> {
  items?: T[];
  posts?: T[];
  outfits?: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export type User = {
  id: string;
  name: string;
  email: string;
  type: 'USER' | 'STORE';
  gender: 'FEMALE' | 'MALE' | 'OTHER';
  mannequinPreference: 'Woman' | 'Man' | 'Neutral';
  style?: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ClothingItem = {
  id: string;
  userId: string;
  photoUrl: string;
  type: string;
  color: string;
  season: string;
  occasion: string;
  tags: string[];
  createdAt: Date;
};

export type SavedOutfit = {
  id: string;
  userId: string;
  imageUrl: string;
  reasoning: string;
  itemsJson: string;
  items?: Array<{
    id: string;
    type: string;
    reason: string;
  }>;
  createdAt: Date;
};

export type FeedPost = {
  id: string;
  storeId: string;
  imageUrl: string;
  caption: string;
  createdAt: Date;
  store: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  likesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
};


// AI Flow Related Types
export type AnalyzeClothingInput = {
  photoDataUri: string;
};

export type AnalyzeClothingOutput = {
  type: string;
  color: string;
  season: string;
  occasion: string;
  tags: string[];
  confidence: number;
  // Novos campos do backend atualizado
  reasoning?: string; // Explicação da análise
  qualityScore?: number; // Score de qualidade (0-1)
  retryCount?: number; // Número de tentativas
};

export type GenerateOutfitInput = {
  occasion: string;
  weather?: string;
  season?: string;
  style?: string;
  colors?: string[];
  excludeItems?: string[];
  mannequinPreference?: 'Woman' | 'Man' | 'Neutral';
};

export type OutfitGeneration = {
  selectedItems: Array<{
    id: string;
    type: string;
    reason: string;
  }>;
  reasoning: string;
  styleNotes: string;
  mannequinImagePrompt: string;
  confidence: number;
  outfitId?: string;
  mannequinImage?: string;
};

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  name: string;
  password: string;
  type?: 'USER' | 'STORE';
  gender?: 'FEMALE' | 'MALE' | 'OTHER';
  mannequinPreference?: 'Woman' | 'Man' | 'Neutral';
  style?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Wardrobe Types
export interface AddClothingItemData {
  photoDataUri: string;
}

export interface WardrobeFilters {
  page?: number;
  limit?: number;
  type?: string;
  color?: string;
  season?: string;
  occasion?: string;
}

// Feed Types
export interface CreateFeedPostData {
  imageDataUri: string;
  caption: string;
}

export interface FeedFilters {
  page?: number;
  limit?: number;
}

// Profile Types
export interface UpdateProfileData {
  name?: string;
  bio?: string;
  location?: string;
  style?: string;
  avatarUrl?: string;
}

export interface ProfileStats {
  totalOutfits: number;
  totalLikes: number;
  favoritedOutfits: number;
  aiGeneratedOutfits: number;
  followersCount: number;
  followingCount: number;
}

export interface UserOutfit {
  id: string;
  userId: string;
  title: string;
  imageUrl?: string;
  tags: string[];
  likes: number;
  isLiked: boolean;
  isFavorited: boolean;
  isAIGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LikeData {
  targetId: string;
  targetType: 'OUTFIT' | 'POST';
}

export interface FavoriteData {
  targetId: string;
  targetType: 'OUTFIT' | 'POST';
}

export interface UploadAvatarData {
  imageDataUri: string;
}
