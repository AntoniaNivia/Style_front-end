
export type User = {
  id: string;
  name: string;
  email: string;
  type: 'user' | 'store';
  gender: 'female' | 'male' | 'other';
  mannequin: 'Woman' | 'Man' | 'Neutral';
  style: string;
  avatarUrl?: string;
};

export type ClothingItem = {
  id: string;
  userId: string;
  photoUrl: string; // The public URL from the storage (e.g., Supabase)
  photoDataUri?: string; // Base64 version, only used for upload, not stored in DB
  type: string;
  color: string;
  season: string;
  occasion: string;
  tags: string[];
};

export type Outfit = {
  id: string;
  userId: string;
  items: ClothingItem[];
  mannequinUrl?: string;
  generatedAt: Date;
};

export type FeedPost = {
  id: string;
  storeId: string;
  storeName: string;
  storeAvatarUrl?: string;
  imageUrl: string;
  caption: string;
  hashtags: string[];
  likes: number;
};


// AI Flow Related Types
export type AnalyzeClothingInput = {
  photoDataUri: string;
}

export type AnalyzeClothingOutput = {
  type: string;
  color: string;
  season: string;
  occasion: string;
  tags: string[];
}

export type GenerateOutfitInput = {
  wardrobe: (Omit<ClothingItem, 'id' | 'userId' | 'photoUrl'> & { photoDataUri: string })[];
  userStyle: string;
  climate: string;
  occasion: string;
  mannequinPreference: 'Woman' | 'Man' | 'Neutral';
};

export type EnrichedGenerateOutfitOutput = {
    outfitSuggestion: {
        photoDataUri: string; // The original photo of the clothing item
        type: string;
        description: string;
    }[];
    reasoning: string;
    mannequinPhotoDataUri?: string; // The generated mannequin image
};
